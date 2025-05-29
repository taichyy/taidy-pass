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
    description: 'TaidyPass is a password manager that helps you securely store and manage your credentials. Developed by TaiChe Software Co. Ltd.',
}

// TODO for MVP, feat:
// 1. Add favicon
// 2. 自訂鑰匙圈按下去沒金鑰要可以存金鑰，然後加解密用那組，外加使用者cookie存的那組（先問問GPT）
// 3. 登入之後的 Logo 按下去不要回到產品首頁
// 4. 使用者個人資訊的相關編輯
// 5. 改掉預設大頭貼照片
// 6. 便利貼功能
// 7. 批量選取、移動、刪除功能
// 8. 哪些鑰匙圈預設開關存 cookie
// 9. 改首頁三個大頭貼照片，用可商用插圖
// 10. 頁尾放 Freepik + Lottie

// TODO for MVP, fix:
// 1. 登入、跳轉到資訊頁面之後，似乎不會自動拿資料，要手動 refresh

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
