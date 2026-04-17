import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from 'next'

import './globals.css'
import { TooltipProvider } from "@/components/ui/tooltip";
import ProviderAOS from "@/components/providers/provider-aos";
import { ProviderKey } from "@/components/providers/provider-key";
import { ProviderTheme } from "@/components/providers/provider-theme";

export const viewport: Viewport = {
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
}

export const metadata: Metadata = {
    title: 'TaidyPass | 最安全的密碼管理器',
    description: 'TaidyPass is a password manager that helps you securely store and manage your credentials. Developed by TaiChe Digital Co. Ltd.',
    other: {
        "monetag": process.env.NEXT_PUBLIC_MONETAG ?? "",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-background text-foreground">
                <ProviderTheme
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <ProviderAOS>
                        <Toaster />
                        <TooltipProvider>
                            <ProviderKey>
                                {children}
                            </ProviderKey>
                        </TooltipProvider>
                    </ProviderAOS>
                </ProviderTheme>
            </body>
        </html>
    )
}
