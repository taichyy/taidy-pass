import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not set');
        return new Response(JSON.stringify("Server error! JWT secret not set."), {
            status: 500,
        });
    }

    const token = request.cookies.get('token')?.value;

    if (!token && request.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Prevent logged-in users from accessing /login
    if (token && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify the token using `jose`
    try {
        if (token) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(token, secret);
        }
    } catch (err) {
        console.error('Token verification failed:', err);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
    matcher: [
        '/login',
        '/'
    ],
};