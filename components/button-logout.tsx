"use client"
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";

const ButtonLogout = () => {
    const router = useRouter()
    
    const handleClick = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
        router.push('/login')
    }

    return (
        <Button onClick={() => handleClick()}>
            登出
        </Button>
    );
}

export default ButtonLogout;