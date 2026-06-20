import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import LogoText from "@/components/logo-text";
import { Button } from "@/components/ui/button";
import FormVerify from "./(components)/form-veriry";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import DesignedByFreepik from "@/components/designed-by-freepik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = async (
    props:{
        searchParams: Promise<{
            mode?: "register" | "login"
        }>
    }
) => {
    const searchParams = await props.searchParams;
    const { mode } = searchParams;

    const imageSrc = mode === "register" ? "/register.png" : "/login.png";

    return (
        <main className="flex flex-col gap-2 justify-center items-center h-[100dvh] w-fit ml-auto mr-auto">
            <Link 
                href="/" 
                data-aos={mode == "login" ? "fade-right" : "fade-left"}
                data-aos-anchor-placement="top-center"
                data-aos-delay={400}
                className="w-fit mr-auto text-slate-800"
            >
                <Button variant="outline" className="dark:bg-accent/80 dark:text-white">
                    <ArrowLeft className="mr-1" size={20} />
                    返回
                </Button>
            </Link>
            <Card 
                className="relative w-fit min-w-[min(350px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900"
                data-aos={mode == "login" ? "fade-right" : "fade-left"}
                data-aos-anchor-placement="top-center"
            >
                <CardHeader>
                    <CardTitle>
                        <div className=" flex justify-between">
                            <LogoText />
                            <ThemeModeToggle />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="block w-[300px] max-w-full md:grid md:w-fit md:max-w-none md:grid-cols-[300px_300px] gap-4">
                        <div className="relative">
                            <Image
                                src={imageSrc}
                                alt="Login hero"
                                width={300}
                                height={300}
                                className="aspect-auto hidden md:block hover:scale-105 transition-transform duration-300 ease-in-out opacity-90"
                            />
                            <DesignedByFreepik className="absolute bottom-0 left-0 hidden md:block"  />
                        </div>
                        <FormVerify mode={mode} />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

export default LoginPage;
