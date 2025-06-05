"use client"
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import DialogDoubleCheck from "../dialog-double-check";
import { useDoubleCheckStore } from "@/lib/stores/use-double-check-store";

const ButtonLogout = () => {
    const router = useRouter()

    const { setDoubleCheckOpen } = useDoubleCheckStore();
    
    const handleClick = async () => {
        // remove cookie server-side
        await fetch("/api/session", { method: "DELETE" }); 
        router.refresh()
    };
    return (
        <>
            <Button onClick={() => setDoubleCheckOpen("logout", true)}>
                確定登出
            </Button>
            <DialogDoubleCheck
                id="logout"
                title="確定登出"
                desc="請務必確實記下您的登入密碼。如果重設密碼，將會清除所有資料。"
                doFunction={handleClick}
            />
        </>
    );
}

export default ButtonLogout;