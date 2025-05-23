"use client"
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

const ButtonLogout = () => {
    const router = useRouter()
    
    const handleClick = async () => {
        // remove cookie server-side
        await fetch("/api/session", { method: "DELETE" }); 
        
        router.push("/login");
    };
    return (
        <Button onClick={() => handleClick()}>
            登出
        </Button>
    );
}

export default ButtonLogout;