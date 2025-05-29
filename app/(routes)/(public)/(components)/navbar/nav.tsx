"use client"
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HiBars3BottomRight } from "react-icons/hi2";

import { TNavItem } from "@/lib/types";
import LogoText from "@/components/logo-text";
import { cn } from "@/lib/utils";

type Props = {
    navLinks: TNavItem[]
    setShowNav: (showNav: boolean) => void;
}

const Nav = ({
    navLinks,
    setShowNav
}: Props) => {
    const pathname = usePathname()
    
    useEffect(() => {
        setShowNav(false)
    }, [pathname])
    
    return (
        <div className={`fixed top-0 left-0 bg-white shadow-md w-full transition-all duration-200 h-[12vh] z-[1000]`}>
            <div className="flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto">
                <LogoText />
                {/* NavLinks */}
                <div className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link href={link.url} key={link.id} onClick={() => setShowNav(false)}>
                            <p className={cn(
                                "nav_link",
                                pathname === link.url ? "text-blue-700 font-bold" : "text-gray-600 hover:text-blue-700 transition-all duration-200"
                            )}>
                                {link.label}
                            </p>
                        </Link>
                    ))}
                </div>
                {/* Buttons */}
                <div className="block md:hidden">
                    {/* <button className="md:px-8 md:py-2.5 px-6 py-2 text-white font-semibold text-base bg-blue-700 hover:bg-blue-900 transition-all duration-200 rounded-full">
                        Join Now
                    </button> */}
                    {/* Burger menu */}
                    <HiBars3BottomRight onClick={() => setShowNav(true)} className="w-8 h-8 cursor-pointer text-black lg:hidden" />
                </div>
            </div>
        </div>
    );
}

export default Nav;