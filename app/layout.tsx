import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from 'next'

import './globals.css'
 
export const viewport: Viewport = {
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
}

export const metadata: Metadata = {
    title: 'Password Manager | Taichyy',
    description: 'A Next.js 14 password manager developed by Tai-Cheng, Yen.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Toaster />
                {children}
            </body>
        </html>
    )
}
