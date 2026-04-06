import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from "@/src/lib/sbAdmin";
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/src/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

const ipStore = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;

function getClientIp(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = ipStore.get(ip);

  if (!current || current.resetAt < now) {
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  current.count += 1;
  ipStore.set(ip, current);
  return true;
}

function sanitizeFolder(input: string) {
  return input
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .replace(/\.{2,}/g, '')
    .replace(/^\/+/, '')
    .slice(0, 120) || 'school_uploads';
}

function getExtension(mimeType: string) {
  switch (mimeType) {
    case 'image/jpeg': return '.jpg';
    case 'image/png': return '.png';
    case 'image/webp': return '.webp';
    case 'image/gif': return '.gif';
    case 'application/pdf': return '.pdf';
    default: return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many upload requests. Please try again later.' }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const rawFolder = String(formData.get('folder') || 'school_uploads');
    const folder = sanitizeFolder(rawFolder);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File is too large. Max size is 10MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const ext = getExtension(file.type);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = `${folder}/${fileName}`;

    // Ensure bucket exists
    const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.getBucket('uploads');
    if (bucketError && bucketError.message.includes('not found')) {
      const { error: createError } = await supabaseAdmin.storage.createBucket('uploads', { 
        public: true,
        allowedMimeTypes: Array.from(ALLOWED_TYPES),
        fileSizeLimit: MAX_FILE_SIZE
      });
      if (createError) {
        console.error('Failed to create bucket:', createError);
        return NextResponse.json({ error: 'Storage setup failed. Please contact admin.' }, { status: 500 });
      }
    }

    // Upload to Supabase Storage 'uploads' bucket
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ 
        error: uploadError.message || 'Failed to upload file to storage',
        details: uploadError
      }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Upload route error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
