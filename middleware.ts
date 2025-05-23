import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || '')

const vaultRoute = '/vault'
const loginRoute = '/login'

const protectedRoutes = [
    vaultRoute,
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    const redirect = (url: string) => {
        return NextResponse.redirect(new URL(url, request.url))
    }

    // Handle /login and logic
    if ([loginRoute, vaultRoute].includes(pathname)) {
        if (token) {
            try {
                const verify = await jwtVerify(token, jwtSecret)

                if (verify) {
                    if (pathname !== vaultRoute) {
                        return redirect(vaultRoute)
                    }
                }

                return NextResponse.next()
            } catch (err) {
                return NextResponse.next()
            }
        }

        return NextResponse.next()
    }

    // Protected routes
    if (protectedRoutes.includes(pathname)) {
        if (!token) return redirect('/')

        try {
            await jwtVerify(token, jwtSecret)
            return NextResponse.next()
        } catch (err) {
            return redirect('/login')
        }
    }

    return NextResponse.next()
}
