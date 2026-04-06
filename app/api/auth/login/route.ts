import { NextResponse } from 'next/server';
import { supabaseAdmin } from "../../../../src/lib/sbAdmin";
import { verifyPassword, encrypt } from '../../../../src/lib/auth';
import { SESSION_COOKIE_NAME } from '../../../../src/lib/auth-shared';
import { cookies } from 'next/headers';
import { ensureAdminSeed } from '../../../../src/lib/bootstrap';
import { z } from 'zod';

const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const FALLBACK_ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const FALLBACK_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function createSessionResponse(admin: { id: string; username: string; role: string }) {
  return (async () => {
    const sessionData = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    };
    const session = await encrypt(sessionData);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours to match JWT expiry
    });

    return NextResponse.json({ success: true, user: sessionData });
  })();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { username, password } = result.data;

    try {
      await ensureAdminSeed();

      const { data: admin, error } = await supabaseAdmin
        .from('admins')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (!error && admin) {
        const isValid = await verifyPassword(password, admin.password_hash);
        if (isValid) {
          return await createSessionResponse({
            id: admin.id,
            username: admin.username,
            role: admin.role,
          });
        }
      }
    } catch (dbError) {
      console.warn('Database-backed admin login unavailable, checking fallback credentials.', dbError);
    }

    // Check Fallback Credentials (only if explicitly set in env)
    if (FALLBACK_ADMIN_USERNAME && FALLBACK_ADMIN_PASSWORD) {
      if (username === FALLBACK_ADMIN_USERNAME && password === FALLBACK_ADMIN_PASSWORD) {
        return await createSessionResponse({
          id: '00000000-0000-0000-0000-000000000000',
          username: FALLBACK_ADMIN_USERNAME,
          role: 'admin',
        });
      }
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
