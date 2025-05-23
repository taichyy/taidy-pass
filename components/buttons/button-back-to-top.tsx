"use client"
import { useEffect, useState } from "react"
import { ArrowUpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const ButtonBackToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show if scrolled down 100px
            setIsVisible(window.scrollY > 100)
        }

        const checkIfScrollable = () => {
            // Show if page is scrollable
            const isPageScrollable = document.body.scrollHeight > window.innerHeight
            setIsVisible(isPageScrollable && window.scrollY > 100)
        }

        window.addEventListener("scroll", handleScroll)
        window.addEventListener("resize", checkIfScrollable)
        // Initial check on mount
        checkIfScrollable() 

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", checkIfScrollable)
        }
    }, [])

    return (
        <ArrowUpCircle
            className={cn(
                "fixed bottom-4 right-4 h-10 w-10 cursor-pointer rounded-full bg-primary text-primary-foreground p-2 shadow-md transition-all duration-200 ease-in-out hover:scale-110 hover:bg-primary/80 active:scale-95",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
        />
    )
}

export default ButtonBackToTop
