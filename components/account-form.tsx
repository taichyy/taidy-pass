"use client";
import { useState, useEffect, FormEvent } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { PenBoxIcon, PlusCircle } from "lucide-react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface AccountFormProps {
    type: "edit" | "add";
    id?: string; // Required for edit mode
}

const AccountForm = ({ type, id }: AccountFormProps) => {
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const [formData, setFormData] = useState({ title: "", username: "", password: "" });

    // Fetch existing data for edit mode
    const { data, error, isLoading, mutate } = useSWR(
        type === "edit" && opened ? `/api/accounts/${id}` : null,
        (url) => fetch(url).then((res) => res.json())
    );

    // Sync fetched data with formData when in edit mode
    useEffect(() => {
        if (data && type === "edit") {
            setFormData({
                title: data.title,
                username: data.username,
                password: data.password,
            });
        }
    }, [data, type]);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission (POST for add, PUT for edit)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = type === "edit" ? `/api/accounts/${id}` : "/api/accounts/";
        const method = type === "edit" ? "PUT" : "POST";

        try {
            await fetch(url, {
                method,
                body: JSON.stringify(formData),
            });

            await mutate();
            router.refresh();
            toast.success(type === "edit" ? "更改成功！" : "新增成功！");
            setOpened(false);
        } catch (err) {
            console.error(err);
            toast.error(type === "edit" ? "更改失敗！" : "新增失敗！");
        }
    };

    // Handle delete (only for edit mode)
    const handleDelete = async () => {
        if (confirm("確定要刪除嗎？")) {
            try {
                await fetch(`/api/accounts/${id}`, { method: "DELETE" });
                await mutate();
                router.refresh();
                toast.success("刪除成功！");
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <Dialog onOpenChange={(e) => setOpened(e)}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger>
                        {type === "edit" ? <PenBoxIcon /> : <PlusCircle className="cursor-pointer" size={24} />}
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{type === "edit" ? "編輯紀錄" : "新增紀錄"}</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>{type === "edit" ? "更改資料" : "新增資料"}</DialogTitle>
                    {isLoading && type === "edit" && opened ? (
                        "Loading..."
                    ) : (
                        <form onSubmit={handleSubmit} className="text-left">
                            <div>
                                <h2>項目名稱</h2>
                                <Input name="title" className="mt-2" value={formData.title} onChange={handleChange} />
                            </div>
                            <div>
                                <h2>帳號</h2>
                                <Input name="username" className="mt-2" value={formData.username} onChange={handleChange} />
                            </div>
                            <div>
                                <h2>密碼</h2>
                                <Input name="password" className="mt-2" value={formData.password} onChange={handleChange} />
                            </div>
                            <DialogClose asChild>
                                <Button type="submit" className="mt-4 w-full">
                                    {type === "edit" ? "確定編輯" : "確定新增"}
                                </Button>
                            </DialogClose>
                            {type === "edit" && (
                                <DialogClose asChild>
                                    <Button variant="destructive" className="mt-4 w-full" onClick={handleDelete}>
                                        刪除
                                    </Button>
                                </DialogClose>
                            )}
                        </form>
                    )}
                </DialogHeader>
                {error && <p className="text-red-700">Error fetching data</p>}
            </DialogContent>
        </Dialog>
    );
};

export default AccountForm;