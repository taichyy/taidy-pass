"use client"
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Edit = ({ id, verified, setVerified, Icon }) => {

    const [msg, setMsg] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (e.target['password'].value == '7768') {
            setVerified(true)
        } else {
            setMsg("密碼錯誤！")
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Icon size={16} />
            </DialogTrigger>
            <DialogContent className="max-w-[300px]">
                <DialogHeader>
                    <DialogTitle>輸入密碼</DialogTitle>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <Input name="password" className="mt-4" />
                        <Button type="submit" className="mt-4 w-full">
                            確定
                        </Button>
                    </form>
                </DialogHeader>
                <DialogDescription className="text-red-700">
                    {msg}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

export default Edit;