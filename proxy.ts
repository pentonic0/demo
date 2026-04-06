import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './src/lib/auth';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  
  if (url.pathname.startsWith('/admin')) {
    if (url.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  const response = NextResponse.next();

  if (url.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
