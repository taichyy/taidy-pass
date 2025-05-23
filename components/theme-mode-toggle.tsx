"use client"
import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function ThemeModeToggle() {
    const { setTheme } = useTheme()

    const themes = [
        { 
            theme: "light",
            desc: "白色",
        },
        { 
            theme: "dark",
            desc: "黑色",
        },
        { 
            theme: "system",
            desc: "系統設定",
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((item) => (
                    <DropdownMenuItem key={item.theme} onClick={() => setTheme(item.theme)}>
                        {item.desc}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
