"use client"
import { useState } from "react";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddForm = () => {
    const router = useRouter()
    const [msg, setMsg] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const title = e.target.title.value
        const username = e.target.username.value
        const password = e.target.password.value

        const obj = {
            title: title,
            username: username,
            password: password
        }

        try {
            await fetch(`/api/accounts/`, {
                method: "POST",
                body: JSON.stringify(obj)
            })
            
            toast.success("新增成功！")
            router.refresh()
        } catch (err) {
            console.log(err)
            toast.error("新增失敗！")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>新增</Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>新增資料</DialogTitle>
                    <form onSubmit={(e) => handleSubmit(e)} className=" text-left">
                        <div>
                            <h2>項目名稱</h2>
                            <Input name="title" className="mt-2 w-[600px]" />
                        </div>
                        <div>
                            <h2>帳號</h2>
                            <Input name="username" className="mt-2" />
                        </div>
                        <div>
                            <h2>密碼</h2>
                            <Input name="password" className="mt-2" />
                        </div>
                        <DialogClose asChild>
                            <Button type="submit" className="mt-4 w-full">
                                確定
                            </Button>
                        </DialogClose>
                    </form>
                </DialogHeader>
                <DialogDescription className="text-red-700">{msg}</DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

export default AddForm;