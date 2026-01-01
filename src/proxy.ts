import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/src/lib/auth';

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Security headers for all responses
    const securityHeaders = {
        'X-DNS-Prefetch-Control': 'on',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };

    // Protected admin routes (not API routes, those handle auth internally)
    if (pathname.startsWith('/admin/dashboard')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token || !verifyToken(token)) {
            // Redirect to login page
            const url = request.nextUrl.clone();
            url.pathname = '/admin';
            return NextResponse.redirect(url);
        }
    }

    // Allow the request with security headers
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
