import Link from "next/link";
import { Cloudy, Lock, LockKeyhole, Tags, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import LottieHero from "./(components)/lottie-hero";

// Main
type TMain = {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
}
const main : TMain = {
    title: "隱私性最高的密碼管理器",
    description: "我們採用 0-Knowledge 架構，除了你以外，沒有人知道你的密碼。",
    buttonText: "瞭解更多",
    buttonUrl: "/blog/0-knowledge",
}

// Review section.
type TReview = {
    name: string;
    role: string;
    avatar: string;
    quote: string;
}
const reviewTitle = "用戶怎麼說？";
const reviews: TReview[] = [
    {
        name: "Alice",
        role: "自由設計師",
        avatar: "https://i.pravatar.cc/100?img=1",
        quote: "我以前一直用同一個密碼，超不安全，現在終於可以放心亂設密碼了！",
    },
    {
        name: "Kevin",
        role: "上班族",
        avatar: "https://i.pravatar.cc/100?img=2",
        quote: "自從有了 TaidyPass，我再也不用問老婆我 Netflix 密碼是多少了。",
    },
    {
        name: "Ming",
        role: "大學生",
        avatar: "https://i.pravatar.cc/100?img=3",
        quote: "簡單好用又有中文介面，推薦給爸媽也能輕鬆上手。",
    },
]

// Why choose us section.
type TWhyChoose = {
    label: string;
    Icon: any;
}
const whyChooseTitle = "為什麼選擇我們？";
const whyChooseDesc = "只要保存好您的金鑰，我們就能幫您保護所有密碼。這是我們的承諾。";
const iconProps = {
    className: "text-primary/70",
    size: 52,
}
const whyChoose: TWhyChoose[] = [
    { label: "確保最高安全等級", Icon: <Lock {...iconProps} /> },
    { label: "多設備無縫存取，方便快捷", Icon: <Cloudy {...iconProps} /> },
    { label: "自訂分類與標籤", Icon: <Tags {...iconProps} /> },
    { label: "持續更新與安全修補", Icon: <Wrench {...iconProps} /> },
];

const RootPage = () => {
    return (
        <section className="pt-32 pb-10">
            <div className="container">
                {/* Main */}
                <div className="grid gap-7 lg:grid-cols-5 lg:pr-20">
                    {/* Left hero */}
                    <div className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-3">
                        <div className="aspect-square w-1/2 mx-auto">
                            <LottieHero />
                        </div>
                    </div>
                    {/* Top right corner. */}
                    <div 
                        data-aos="fade-in"
                        data-aos-anchor-placement="center"
                        className="flex flex-col gap-7 md:flex-row lg:flex-col lg:col-span-2"
                    >
                        <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-full lg:w-auto">
                            <LockKeyhole />
                            <div>
                                <p className="mb-2 text-lg font-semibold">{main.title}</p>
                                <p className="text-muted-foreground">{main.description}</p>
                            </div>
                            <Button variant="outline" className="mr-auto" asChild>
                                <Link href={main?.buttonUrl || "/#"}>
                                    {main.buttonText}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Reviews */}
                <div className="py-32">
                    <h2 className="text-center text-2xl font-semibold mb-8">
                        {reviewTitle}
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((testimonial, idx) => (
                            <div
                                key={idx}
                                data-aos="fade-left"
                                data-aos-anchor-placement="top-center"
                                data-aos-delay={100 + idx * 100}
                                className="flex flex-col gap-4 rounded-xl border p-6 shadow-sm bg-background"
                            >
                                <p className="text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="text-sm">
                                        <p className="font-medium">{testimonial.name}</p>
                                        <p className="text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Why choose */}
                <div
                    data-aos="fade-in"
                    data-aos-anchor-placement="center" 
                    className="relative overflow-hidden rounded-xl bg-muted p-10 md:p-16"
                >
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <h2 className="text-4xl font-semibold">{whyChooseTitle}</h2>
                        <p className="max-w-screen-sm text-muted-foreground">
                            {whyChooseDesc}
                        </p>
                    </div>
                    <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-between gap-10 text-center">
                        {whyChoose.map((item, idx) => (
                            <div className="flex flex-col gap-4" key={item.label + idx}>
                                <p>{item.label}</p>
                                <span className="flex justify-center">
                                    {item.Icon}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground))_1px,transparent_1px)] bg-[size:80px_80px] opacity-15 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
                </div>
            </div>
        </section>
    );
};

export default RootPage;
