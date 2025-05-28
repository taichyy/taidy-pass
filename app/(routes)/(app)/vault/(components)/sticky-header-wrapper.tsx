"use client"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function StickyHeaderWrapper({ children }: { children: React.ReactNode }) {
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        const sentinel = document.querySelector("#sticky-sentinel")
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting)
            },
            { threshold: [1] }
        )

        if (sentinel) observer.observe(sentinel)

        return () => {
            if (sentinel) observer.unobserve(sentinel)
        }
    }, [])

    return (
        <>
            <div id="sticky-sentinel" className="h-0" />
            <div
                id="sticky-header"
                className={cn(
                    "flex items-center justify-between gap-3 rounded-b-md sticky top-0 z-10 py-2 px-4 transition-colors dark:text-black duration-300",
                    "bg-white shadow-md px-10 md:px-16 xl:px-32",
                    // isSticky && "shadow-sm bg-transparent",
                )}
            >
                {children}
            </div>
        </>
    )
}
