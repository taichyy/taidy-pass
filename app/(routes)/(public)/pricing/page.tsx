import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import YrMoSwitch from "./(components)/yr-mo-switch";
import { Separator } from "@/components/ui/separator";

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: string;
    yearlyPrice: string;
    features: {
        text: string;
    }[];
    button?: {
        text: string;
        url?: string;
    };
    moreTag?: boolean;
    comingSoon?: boolean;
}

const PricingPage = ({
    searchParams,
}: {
    searchParams: { isYearly?: string; };
}) => {
    const isYearly = searchParams.isYearly === "true";

    const heading = "定價方案";
    const description = "探索我們實惠的定價方案";
    const plans: PricingPlan[] = [
        {
            id: "personal",
            name: "Personal",
            description: "個人",
            monthlyPrice: "0",
            yearlyPrice: "0",
            features: [
                { text: "最多 5 組鑰匙圈" },
                { text: "每組鑰匙圈最多儲存 50 組帳號密碼" },
                { text: "無限制使用系統標籤" },
                { text: "最多 50 張便利貼" },
                { text: "透過共享連接分享帳號密碼" },
            ],
        },
        {
            id: "plus",
            name: "Plus",
            description: "進階使用者",
            monthlyPrice: "19",
            yearlyPrice: "179",
            features: [
                { text: "最多 5 位團隊成員" },
                { text: "基本元件庫" },
                { text: "社群支援" },
                { text: "1GB 儲存空間" },
            ],
            button: {
                text: "立即購買",
            },
            moreTag: true,
            comingSoon: true,
        },
        {
            id: "pro",
            name: "Pro",
            description: "專業團隊",
            monthlyPrice: "49",
            yearlyPrice: "359",
            features: [
                { text: "不限團隊成員" },
                { text: "進階元件庫" },
                { text: "優先支援" },
                { text: "無限儲存空間" },
            ],
            button: {
                text: "立即購買",
            },
            moreTag: true,
            comingSoon: true,
        },
    ]

    return (
        <section className="py-16 lg:py-24">
            <div className="container">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
                    <h2 className="text-3xl font-semibold text-pretty lg:text-5xl">
                        {heading}
                    </h2>
                    <p className="text-muted-foreground lg:text-lg">
                        {description}
                    </p>
                    <YrMoSwitch isYearly={isYearly} />
                    <div className="flex flex-col items-stretch gap-6 lg:flex-row">
                        {plans.map((plan, index) => (
                            <Card
                                key={plan.id}
                                className="flex w-80 flex-col justify-between text-left"
                            >
                                <CardHeader>
                                    <CardTitle>
                                        <p>{plan.name}</p>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-end">
                                        {plan.monthlyPrice != "0" ? (
                                            <>
                                                <span className="text-4xl font-semibold">
                                                    {plan.comingSoon ? "--" : isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                                </span>
                                                <span className="text-2xl font-semibold text-muted-foreground">
                                                    {isYearly ? "/年" : "/月"}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-4xl font-semibold text-primary">
                                                免費！
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Separator className="mb-6" />
                                    {plan.moreTag && (
                                        <p className="mb-3 font-semibold">
                                            所有 {plans[index - 1].name} 的功能，外加：
                                        </p>
                                    )}
                                    <ul className="space-y-4">
                                        {(plan.comingSoon ? [{ text: "--" }] : plan.features).map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <CheckCircle className="size-4" />
                                                <span>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                {plan.button && (
                                    <CardFooter className="mt-auto">
                                        <Button
                                            asChild
                                            className="w-full"
                                            variant={plan.comingSoon ? "outline" : "default"}
                                        >
                                            <Link href={plan.button?.url || "#"} target="_blank">
                                                {plan.comingSoon ? "尚未開放" : plan.button?.text}
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PricingPage;