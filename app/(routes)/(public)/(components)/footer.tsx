import { cn } from "@/lib/utils";
import LogoText from "@/components/logo-text";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

const copyrightText = `© ${new Date().getFullYear()} TaiChe Technology. All rights reserved.`;

const DialogTerms = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <li className="underline hover:text-primary">
                    使用條款
                </li>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        使用條款（Terms and Conditions）
                    </DialogTitle>
                    <DialogDescription>
                        歡迎使用 TaidyPass（以下簡稱「本服務」）。在註冊帳號或使用本服務之前，請詳細閱讀以下使用條款。
                    </DialogDescription>
                    <article className="flex flex-col gap-3 pt-4 text-sm text-slate-800">
                        <p className="-indent-4 ml-4">
                            1. 服務內容<br />
                            本服務提供一款基於零知識架構的密碼管理器。所有使用者資料僅於本地端加密後儲存至伺服器，我們無法、也不會嘗試存取您的密碼內容。
                        </p>
                        <p className="-indent-4 ml-4">
                            2. 帳號註冊與使用<br />
                            使用本服務需註冊帳號並提供有效電子郵件信箱。使用者可隨時於帳號設定中刪除帳號。註冊帳號即表示您同意遵守本服務條款。
                        </p>
                        <p className="-indent-4 ml-4">
                            3. 使用者責任<br />
                            您應妥善保管帳號登入資訊、個人金鑰，並確保所使用之設備安全。我們不對因密碼洩漏所造成的任何損失負責。
                        </p>
                        <p className="-indent-4 ml-4">
                            4. 服務變更與終止<br />
                            我們保留隨時修改、暫停或終止本服務的權利。若因不可抗力或其他不可預期因素導致資料遺失，我們將盡最大努力恢復資料，但不承擔資料遺失責任。
                        </p>
                        <p className="-indent-4 ml-4">
                            5. 免責聲明<br />
                            本服務採用業界最佳安全實踐，理論上即便資料被竊取，也僅可獲取密文，竊取者並沒有辦法獲取真實的儲存資料，但 TaidyPass 團隊不保證資料永遠不會被第三方未經授權存取，也不負任何損害賠償責任。
                        </p>
                    </article>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

const DialogPrivacy = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <li className="underline hover:text-primary">
                    隱私權政策
                </li>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        隱私權政策（Privacy Policy）
                    </DialogTitle>
                    <DialogDescription>
                        我們重視您的個人資料保護，以下是我們的隱私政策。
                    </DialogDescription>
                    <article className="flex flex-col gap-3 pt-4 text-sm text-slate-800">
                        <p className="-indent-4 ml-4">
                            1. 我們收集哪些資料？<br />
                            電子郵件地址（註冊與登入用）<br />
                            登入帳號、密碼（經過加密處理，我們無法得知您的實際密碼）
                        </p>
                        <p className="-indent-4 ml-4">
                            2. 資料如何使用？<br />
                            提供帳號登入、帳號找回等功能<br />
                            系統安全維護與改善使用者體驗
                        </p>
                        <p className="-indent-4 ml-4">
                            3. 我們儲存資料的地點<br />
                            所有資料皆儲存於安全的雲端 MongoDB 資料庫，網站則架設於 Vercel。所有敏感資訊僅於您的裝置處理加密後儲存，伺服器無法解密內容。
                        </p>
                        <p className="-indent-4 ml-4">
                            4. 是否與第三方分享資料？<br />
                            我們不會與任何第三方分享您的個人資料。
                        </p>
                        <p className="-indent-4 ml-4">
                            5. 用戶權利<br />
                            您可以隨時刪除帳號<br />
                            您可以聯繫我們要求移除個人資料（若技術上可行）
                        </p>
                    </article>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

const Footer = ({
    menuItems = [
        // {
        //     "title": "資源",
        //     "title": "",
        //     "links": [
        //         { "text": "協助", "url": "#" },
        //         { "text": "銷售", "url": "#" },
        //         { "text": "廣告", "url": "#" }
        //     ]
        // },
        {
            "title": "產品",
            "links": [
                // { "text": "概覽", "url": "#" },
                // { "text": "價格", "url": "#" },
                // { "text": "市集", "url": "#" },
                // { "text": "功能", "url": "#" },
                // { "text": "整合", "url": "#" },
                { "text": "價格方案", "url": "/pricing" }
            ]
        },
        {
            "title": "公司",
            "links": [
                { "text": "關於我們", "url": "/about" },
                { "text": "聯絡我們", "url": "/contact" },
            ]
        },
        {
            "title": "相關文章",
            "links": [
                { "text": "0-Knowledge 架構", "url": "/blog/0-knowledge" },
                // { "text": "Instagram", "url": "#" },
                // { "text": "LinkedIn", "url": "#" }
            ]
        },
    ],
    copyright = copyrightText,
}: {
    menuItems?: MenuItem[];
    copyright?: string;
}) => {
    return (
        <section className="py-32">
            <div className="container">
                <footer>
                    <div className={cn(
                        "flex flex-wrap lg:grid gap-8",
                        `lg:grid-cols-${menuItems.length + 2}`,
                    )}>
                        <div className="w-full lg:col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                <LogoText />
                            </div>
                        </div>
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx} className="pl-4 lg:pl-0">
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                        <p>{copyright}</p>
                        <ul className="flex gap-4">
                            <DialogTerms />
                            <DialogPrivacy />
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default Footer;
