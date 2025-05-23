import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from 'next'

import './globals.css'
import { TooltipProvider } from "@/components/ui/tooltip";
import ProviderAOS from "@/components/providers/provider-aos";
import { ProviderTheme } from "@/components/providers/provider-theme";
import { ProviderKey } from "@/components/providers/provider-key";

export const viewport: Viewport = {
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
}

export const metadata: Metadata = {
    title: 'TaidyPass | 最安全的密碼管理器',
    description: 'TaidyPass is a password manager that helps you securely store and manage your credentials. Developed by TaiChee Digital Technology.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
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
