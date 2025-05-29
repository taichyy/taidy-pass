import Image from "next/image";

const defaultAchievements = [
    { label: "業界標準加密演算法", value: "SHA-256" },
    { label: "Zero-Knowledge 架構", value: "100%" },
    { label: "對您隱私的存取性", value: "0%" },
    { label: "支援設備數量", value: "無限" },
];

const title = "關於我們";
const description = "TaidyPass 是一個由資深工程師組成、充滿熱情的團隊。致力於為您打造專業的密碼管理器——就像一位守口如瓶、值得信賴的隨身秘書。";
const mainImage = {
    src: "/about.png",
    alt: "佔位圖",
};
const secondaryImage = {
    src: "https://shadcnblocks.com/images/block/placeholder-2.svg",
    alt: "佔位圖",
};
const breakout = {
    src: "/logoWithoutText.png",
    alt: "logo",
    title: "由太馳資訊－TaidyPass 團隊開發",
    description: "為企業提供有效的工具，改善工作流程、提升效率並促進成長。",
    buttonText: "了解更多",
    buttonUrl: "https://shadcnblocks.com",
};
const achievementsTitle = "我們的使命";
const achievementsDescription = "打造世界上最簡單、最安全的密碼管理體驗，讓每個人都能安全管理密碼。";
const achievements = defaultAchievements;

const AboutPage = () => {
    return (
        <section className="pt-32 pb-6">
            <div className="container px-20">
                <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
                    <h1 className="text-5xl font-semibold">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <div className="grid gap-7 lg:grid-cols-3">
                    <Image
                        width={800}
                        height={600}
                        src={mainImage.src}
                        alt={mainImage.alt}
                        className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
                    />
                    <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
                        <div className="bg-muted flex flex-col justify-between gap-6 rounded-xl p-7 md:w-1/2 lg:w-auto">
                            <Image
                                width={48}
                                height={48}
                                src={breakout.src}
                                alt={breakout.alt}
                                className="mr-auto h-12"
                            />
                            <div>
                                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                                <p className="text-muted-foreground">{breakout.description}</p>
                            </div>
                            {/* <Button variant="outline" className="mr-auto" asChild>
                                <a href={breakout.buttonUrl} target="_blank">
                                    {breakout.buttonText}
                                </a>
                            </Button> */}
                        </div>
                        {/* <Image
                            width={800}
                            height={600}
                            src={secondaryImage.src}
                            alt={secondaryImage.alt}
                            className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
                        /> */}
                    </div>
                </div>
                <div className="bg-muted relative overflow-hidden rounded-xl p-10 md:p-16 my-16">
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <h2 className="text-4xl font-semibold">{achievementsTitle}</h2>
                        <p className="text-muted-foreground max-w-xl">
                            {achievementsDescription}
                        </p>
                    </div>
                    <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
                        {achievements.map((item, idx) => (
                            <div className="flex flex-col gap-4" key={item.label + idx}>
                                <p>{item.label}</p>
                                <span className="text-4xl font-semibold md:text-5xl">
                                    {item.value}
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

export default AboutPage;
