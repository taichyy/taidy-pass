import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || '')

const loginRoute = "/login"
const protectedRoutes = [
    '/vault'
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    // 如果是受保護的路由
    if (protectedRoutes.includes(pathname)) {
        if (!token) {
            // 沒有 token，直接轉到 loginRoute
            return NextResponse.redirect(new URL(loginRoute, request.url))
        }

        try {
            // 驗證 token
            await jwtVerify(token, jwtSecret)
            return NextResponse.next() // token 有效，放行
        } catch (err) {
            // token 無效或過期，轉到 loginRoute
            return NextResponse.redirect(new URL(loginRoute, request.url))
        }
    }

    // 如果是 loginRoute 頁面，並且有 token，直接導向 /vault
    if (pathname === loginRoute && token) {
        try {
            await jwtVerify(token, jwtSecret)
            return NextResponse.redirect(new URL('/vault', request.url))
        } catch (err) {
            // token 無效或過期，繼續留在 loginRoute
            return NextResponse.next()
        }
    }

    // 其他路由，放行
    return NextResponse.next()
}
