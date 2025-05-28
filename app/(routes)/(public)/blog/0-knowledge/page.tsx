"use client";
import {
    AlignLeft,
    GalleryVerticalEnd,
    Lightbulb,
    ListChecks,
    RefreshCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ZeroKnowledgePage = () => {
    const sectionRefs = useRef<Record<string, HTMLElement>>({});
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const sections = Object.keys(sectionRefs.current);

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        let observer: IntersectionObserver | null = new IntersectionObserver(
            observerCallback,
            {
                root: null,
                rootMargin: "0px",
                threshold: 1,
            },
        );

        sections.forEach((sectionId) => {
            const element = sectionRefs.current[sectionId];
            if (element) {
                observer?.observe(element);
            }
        });

        return () => {
            observer?.disconnect();
            observer = null;
        };
    }, []);

    const addSectionRef = (id: string, ref: HTMLElement | null) => {
        if (ref) {
            sectionRefs.current[id] = ref;
        }
    };

    return (
        <section className="py-32">
            <div className="container max-w-7xl">
                <div className="relative grid-cols-3 gap-20 lg:grid">
                    <div className="lg:col-span-2">
                        <div>
                            <Badge variant="outline">TaidyPass 技術專欄</Badge>
                            <h1 className="mt-3 text-3xl font-extrabold">
                                什麼是 Zero-Knowledge 架構？
                            </h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                在數位安全的世界裡，Zero-Knowledge (零知識) 架構是一種強大的技術，讓使用者可以驗證資料的真實性，而不必暴露任何機密資訊。TaidyPass
                                採用這種架構，確保使用者的密碼與金鑰，只有使用者自己能看到和掌控。
                            </p>
                            <img
                                src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                                alt="Zero-Knowledge Illustration"
                                className="my-8 aspect-video w-full rounded-md object-cover"
                            />
                        </div>

                        <section
                            id="section1"
                            ref={(ref) => addSectionRef("section1", ref)}
                            className="prose my-8 py-6"
                        >
                            <h2 className="text-lg font-bold mb-2 mt-10">Zero-Knowledge 是什麼？</h2>
                            <div className="ml-3.5">
                                <div className="relative flex items-start pb-2">
                                    <div className="absolute top-[2.75rem] h-[calc(100%-2.75rem)] w-px bg-border/70"></div>
                                    <div className="absolute ml-[-14px] py-2">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <RefreshCcw className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                    <div className="pl-12">
                                        <h3 className="mt-2 text-base font-semibold">
                                            基本概念
                                        </h3>
                                        <p>
                                            Zero-Knowledge Proof (零知識證明) 是一種密碼學技術，能讓一方證明「我知道某件事」而不需要洩露該資訊本身。這種架構非常適合敏感資料的驗證與保護。
                                        </p>
                                    </div>
                                </div>
                                <div className="relative flex items-start pb-2">
                                    <div className="absolute top-[2.75rem] h-[calc(100%-2.75rem)] w-px bg-border/70"></div>
                                    <div className="absolute ml-[-14px] py-2">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <GalleryVerticalEnd className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                    <div className="pl-12">
                                        <h3 className="mt-2 text-base font-semibold">
                                            TaidyPass 的應用
                                        </h3>
                                        <p>
                                            在 TaidyPass 中，預設鑰匙圈的資料使用使用者的登入帳號與密碼進行加密。即便是我們的伺服器，也無法得知使用者的真實資料，因為加解密只在用戶端完成。
                                        </p>
                                    </div>
                                </div>
                                <div className="relative flex items-start pb-2">
                                    <div className="absolute top-[2.75rem] h-[calc(100%-2.75rem)] w-px bg-border/70"></div>
                                    <div className="absolute ml-[-14px] py-2">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <ListChecks className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                    <div className="pl-12">
                                        <h3 className="mt-2 text-base font-semibold">
                                            自訂鑰匙圈的安全設計
                                        </h3>
                                        <p>
                                            使用者若建立自訂鑰匙圈，系統會生成一組獨立金鑰，僅提供一次給使用者保存。這確保了只有擁有金鑰的人，能夠存取該鑰匙圈的資料，完全符合零知識原則。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section
                            id="section2"
                            ref={(ref) => addSectionRef("section2", ref)}
                            className="prose my-8 py-6"
                        >
                            <h2 className="text-lg font-bold mb-2 mt-10">技術背後的優勢</h2>
                            <p>
                                Zero-Knowledge 架構的核心優勢，在於「資料只屬於使用者」：平台無法閱讀、無法竊取，只能協助安全儲存和傳輸。即使發生伺服器外洩，資料仍然安全。
                            </p>
                            <Table className="my-6">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>特點</TableHead>
                                        <TableHead>傳統架構</TableHead>
                                        <TableHead>Zero-Knowledge 架構</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>資料存取</TableCell>
                                        <TableCell>伺服器可解密</TableCell>
                                        <TableCell>僅用戶可解密</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>外洩風險</TableCell>
                                        <TableCell>高</TableCell>
                                        <TableCell>極低</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>信任模型</TableCell>
                                        <TableCell>信任平台</TableCell>
                                        <TableCell>只信任自己</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <p>
                                這就是為什麼 TaidyPass 採用 Zero-Knowledge 架構，讓使用者真正掌控自己所有的敏感資訊。
                            </p>
                        </section>

                        <section
                            id="section3"
                            ref={(ref) => addSectionRef("section3", ref)}
                            className="prose my-8 py-6"
                        >
                            <h2 className="text-lg font-bold mb-4 mt-10">你的資料，永遠屬於你</h2>

                            <p>
                                在 <strong>TaidyPass</strong>，<em>密碼與個人資料屬於使用者自己</em>。我們無法、也不需要查看或儲存你的真實資料。換句話說，
                                <strong>你</strong> 是唯一掌控者。
                            </p>

                            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                                「你的資料，你的掌控，TaidyPass 只是你的一把安全鑰匙圈，而非資料的保管人。」
                            </blockquote>

                            <h3 className="mt-6 mb-2 text-base font-semibold">深入了解</h3>
                            <Alert className="my-3">
                                <Lightbulb className="h-4 w-4" />
                                <AlertTitle>延伸閱讀</AlertTitle>
                                <AlertDescription>
                                    想深入瞭解 Zero-Knowledge？我們推薦閱讀{" "}
                                    <a
                                        href="https://en.wikipedia.org/wiki/Zero-knowledge_proof"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline"
                                    >
                                        維基百科條目
                                    </a>
                                    ！
                                </AlertDescription>
                            </Alert>

                            <p>
                                讓我們一起守護數位隱私，實現安全又便利的密碼管理新體驗。
                            </p>
                        </section>

                    </div>

                    <div className="sticky top-8 hidden h-fit lg:block">
                        <span className="flex items-center gap-2 text-sm">
                            <AlignLeft className="h-4 w-4" />
                            頁面欄目
                        </span>
                        <nav className="mt-2 text-sm">
                            <ul>
                                <li>
                                    <a
                                        href="#section1"
                                        className={cn(
                                            "block py-1 transition-colors duration-200",
                                            activeSection === "section1"
                                                ? "font-medium text-primary"
                                                : "text-muted-foreground hover:text-primary",
                                        )}
                                    >
                                        Zero-Knowledge 是什麼？
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#section2"
                                        className={cn(
                                            "block py-1 transition-colors duration-200",
                                            activeSection === "section2"
                                                ? "font-medium text-primary"
                                                : "text-muted-foreground hover:text-primary",
                                        )}
                                    >
                                        技術背後的優勢
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#section3"
                                        className={cn(
                                            "block py-1 transition-colors duration-200",
                                            activeSection === "section3"
                                                ? "font-medium text-primary"
                                                : "text-muted-foreground hover:text-primary",
                                        )}
                                    >
                                        你的資料，永遠屬於你
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ZeroKnowledgePage;