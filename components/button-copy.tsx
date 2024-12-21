"use client"
import { Copy } from "lucide-react"
import toast from "react-hot-toast"

const ButtonCopy = ({
    value,
}:{
    value: string
}) => {
    const handleClick = () => {
        navigator.clipboard.writeText(value.trim())
        toast.success('已複製')
    }

    return (
        <Copy onClick={() => handleClick()} size={16} className="cursor-pointer" />
    );
}
 
export default ButtonCopy;