"use client"
import { FormEvent, useState } from "react";
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if ( !e.target ) {
            return;
        }
        
        const form = e.target as HTMLFormElement;
        const title = (form.elements.namedItem("title") as HTMLInputElement).value
        const username = (form.elements.namedItem("username") as HTMLInputElement).value
        const password = (form.elements.namedItem("password") as HTMLInputElement).value

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
                            <Input name="title" className="mt-2" />
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
            </DialogContent>
        </Dialog>
    );
}

export default AddForm;