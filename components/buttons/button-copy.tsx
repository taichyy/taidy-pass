"use client"
import { Copy } from "lucide-react"
import toast from "react-hot-toast"

import { cn } from "@/lib/utils"

const ButtonCopy = ({
    value,
    className,
}:{
    value: string,
    className?: string,
}) => {
    const handleClick = () => {
        navigator.clipboard.writeText(value.trim())
        toast.success('已複製')
    }

    return (
        <Copy 
            onClick={() => handleClick()} 
            size={16} 
            className={cn(
                "cursor-pointer",
                className
            )}
        />
    );
}
 
export default ButtonCopy;