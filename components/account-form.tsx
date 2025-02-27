"use client";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { PenBoxIcon, PlusCircle } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface AccountFormProps {
    type?: "edit" | "add" | "key";
    id?: string; // Required for edit mode
}

const AccountForm = ({ type = "edit", id }: AccountFormProps) => {
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const [formData, setFormData] = useState({ title: "", username: "", password: "", confirmPassword: "" });

    // Set default values as EDIT mode
    let submitUrl = `/api/accounts/${id}`;
    let submitMethod = "PUT"
    let tooltipText = "編輯紀錄"
    let dialogTitle = "編輯紀錄"
    let btnText = "編輯"
    let confirmText = ""
    switch (type) {
        case "key":
            submitUrl = id ? `/api/accounts/${id}` : "/api/accounts"
            submitMethod = id ? "PUT" : "POST"
            tooltipText = id ? "修改密碼" : "建立帳密"
            dialogTitle = id ? "修改密碼" : "建立帳密"
            btnText = id ? "編輯" : "建立"
            confirmText =  `確定要${id ? "修改" : "建立"}密碼嗎？\n確定${id ? "修改" : "建立"}前請先確定記住了帳號密碼。`
            break;
        case "add":
            submitUrl = "/api/accounts"
            submitMethod = "POST"
            tooltipText = "新增紀錄"
            dialogTitle = "新增紀錄"
            break;
    }

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
                confirmPassword: "",
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

        if (type === "key" && formData.password !== formData.confirmPassword) {
            toast.error("密碼不一致");
            return;
        }

        if (type == "key"){
            setFormData((prev) => ({ ...prev, type: "key" }));
            console.log(formData);
        }

        if (type != "key" || (type === "key" && confirm(confirmText))) {
            try {
                await fetch(submitUrl, {
                    method: submitMethod,
                    body: JSON.stringify(formData),
                });

                await mutate();
                router.refresh();
                toast.success("操作成功");
                setOpened(false);
            } catch (err) {
                console.error(err);
                toast.error("操作失敗");
            }
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
                setOpened(false);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <Dialog onOpenChange={(e) => setOpened(e)} open={opened}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger>
                        {["edit", "key"].includes(type)
                            ? <PenBoxIcon />
                            : <PlusCircle className="cursor-pointer" size={24} />
                        }
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {tooltipText}
                    </p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className="w-[90%]">
                <DialogHeader>
                    <DialogTitle>
                        {dialogTitle}
                    </DialogTitle>
                    {isLoading && ["edit", "key"].includes(type) && opened ? (
                        "Loading..."
                    ) : (
                        <form onSubmit={handleSubmit} className="text-left flex flex-col gap-3">
                            {["edit", "add"].includes(type) && (
                                <div>
                                    <h2>項目名稱</h2>
                                    <Input name="title" className="mt-1" value={formData.title} onChange={handleChange} />
                                </div>
                            )}
                            <div>
                                <h2>帳號</h2>
                                <Input name="username" className="mt-1" value={formData.username} onChange={handleChange} />
                            </div>
                            <div>
                                <h2>密碼</h2>
                                <Input name="password" className="mt-1" value={formData.password} onChange={handleChange} />
                            </div>
                            {type == "key" && (
                                <div>
                                    <h2>確認密碼</h2>
                                    <Input name="confirmPassword" className="mt-1" value={formData.confirmPassword} onChange={handleChange} />
                                </div>
                            )}
                            <div className=" flex justify-end gap-3">
                                <Button type="submit" className="mt-4">
                                    {btnText}
                                </Button>
                                {type === "edit" && (
                                    <Button type="button" variant="destructive" className="mt-4" onClick={handleDelete}>
                                        刪除
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}
                </DialogHeader>
                {error && (
                    <p className="text-red-700">
                        資料獲取錯誤
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AccountForm;