import { Mail, MessageCircle } from "lucide-react";

import LottieEmail from "./(components)/lottie-email";

const title = "聯絡我們";
const description = "聯絡 TaidyPass 團隊，讓我們幫助您。";
const description2 = "請注意，我們無法協助找回您的金鑰";
const emailLabel = "Email";
const emailDescription = "我們將會盡快回覆您的訊息。";
const email = "taichedev@gmail.com";
const msgLabel = "Line";
const msgDescription = "若有更緊急的事項，請透過 Line 聯絡客服人員。";
const msgAddress = "taichenyen";

const ContactPage = () => {
    return (
        <section 
            data-aos="fade-in"
            data-aos-anchor-placement="center"
            className="min-h-[88vh] bg-background py-32 ml-12 flex justify-center items-center gap-12 flex-col lg:flex-row"
        >
            <div>
                <div className="mb-14">
                    <h1 className="mt-2 mb-3 text-3xl font-semibold text-balance md:text-4xl">
                        {title}
                    </h1>
                    <p className="max-w-xl text-lg text-muted-foreground">
                        {description}
                    </p>
                    <p className="max-w-xl mt-1 text-sm text-muted-foreground/70">
                        {description2}
                    </p>
                </div>
                <div className="grid gap-10 md:grid-cols-2">
                    <div>
                        <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent w-fit p-3">
                            <Mail className="h-6 w-auto" />
                        </span>
                        <p className="mb-2 text-lg font-semibold">{emailLabel}</p>
                        <p className="mb-3 text-muted-foreground">{emailDescription}</p>
                        <a
                            href={`mailto:${email}`}
                            className="font-semibold hover:underline"
                        >
                            {email}
                        </a>
                    </div>
                    <div>
                        <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent w-fit p-3">
                            <MessageCircle className="h-6 w-auto" />
                        </span>
                        <p className="mb-2 text-lg font-semibold">{msgLabel}</p>
                        <p className="mb-3 text-muted-foreground">{msgDescription}</p>
                        <a href="#" className="font-semibold hover:underline">
                            {msgAddress}
                        </a>
                    </div>
                </div>
            </div>
            <div 
                data-aos="fade-left"
                data-aos-anchor-placement="center"
                data-aos-delay="300"
                className="w-[400px] aspect-square"
            >
                <LottieEmail />
            </div>
        </section>
    );
};

export default ContactPage;
