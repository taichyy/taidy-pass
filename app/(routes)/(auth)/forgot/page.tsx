import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import LogoText from "@/components/logo-text";
import { Button } from "@/components/ui/button";
import FormForgot from "./(components)/form-forgot";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import DesignedByFreepik from "@/components/designed-by-freepik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ForgotPage = () => {
    const imageSrc = "/login.jpg";

    return (
        <main className="flex flex-col gap-2 justify-center items-center h-[100dvh] w-fit ml-auto mr-auto">
            <Link 
                href="/login?mode=login" 
                data-aos={"fade-right"}
                data-aos-anchor-placement="top-center"
                data-aos-delay={400}
                className="w-fit mr-auto text-slate-800"
            >
                <Button variant="outline">
                    <ArrowLeft className="mr-1" size={20} />
                    返回
                </Button>
            </Link>
            <Card 
                className="w-full relative bg-white min-w-[350px]"
                data-aos={"fade-right"}
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
                    <div className="block md:grid grid-cols-2 gap-4 w-full md:w-fit">
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
                        <FormForgot />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

export default ForgotPage;