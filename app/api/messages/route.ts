import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/src/lib/sbAdmin';

const messageSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(5).max(255),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = messageSchema.parse(body);

    const { error } = await supabaseAdmin.from('messages').insert({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      is_read: false,
      date: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।' }, { status: 500 });
  }
}
