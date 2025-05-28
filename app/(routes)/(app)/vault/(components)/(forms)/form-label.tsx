"use client"
import toast from "react-hot-toast";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, X } from "lucide-react";

import { TLabel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ControlledInput from "@/components/controlled-input";
import DialogDoubleCheck from "@/components/dialog-double-check";
import { useDoubleCheckStore } from "@/lib/stores/use-double-check-store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const FormLabel = ({
    labels,
}: {
    labels: TLabel[]
}) => {
    const router = useRouter()

    const { setOpen } = useDoubleCheckStore()

    const [mode, setMode] = useState<"put" | "post" | "delete" | null>(null)

    const [id, setId] = useState<string>("")
    const [key, setKey] = useState<string>("")
    const [name, setName] = useState<string>("")

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!e.target) {
            return;
        }

        if (!mode) {
            toast.error("請選擇操作模式！")
            return;
        }

        let url = `/api/labels/`
        if (mode === "put") {
            url += id
        } else if (mode === "post") {
            url += ""
        }

        const form = e.target as HTMLFormElement;
        const key = (form.elements.namedItem("key") as HTMLInputElement).value
        const name = (form.elements.namedItem("name") as HTMLInputElement).value

        const body = {
            key,
            name,
        }

        try {
            const req = await fetch(url, {
                method: mode,
                body: JSON.stringify(body)
            })

            const res = await req.json()

            if (!res.status) {
                if (res.type === "duplicated") {
                    toast.error("鍵值重複！")
                    return;
                }
            }

            router.refresh()
            toast.success("分類標籤新增成功！")
        } catch (err) {
            console.log(err)
            toast.error("分類標籤新增失敗！")
        }
    }

    const handleDelete = async () => {
        if (!id) return;

        // Don't do toast here, because it will be handled in DialogDoubleCheck
        try {
            const req = await fetch(`/api/labels/${id}`, {
                method: "DELETE"
            })

            const res = await req.json()

            if (!res.status) {
                toast.error("刪除失敗！")
                return;
            }

            router.refresh()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <form onSubmit={mode ? handleSubmit : () => {}}>
                <div className=" flex gap-2 items-center flex-wrap">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                onClick={() => {
                                    setId("")
                                    setKey("")
                                    setName("")
                                    setMode("post")
                                }}
                            >
                                <PlusCircle
                                    size={24}
                                    className="text-slate-800 cursor-pointer"
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            新增
                        </TooltipContent>
                    </Tooltip>

                    {labels.map((label, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-0.5">
                                    <Badge
                                        onClick={() => {
                                            setMode("put")
                                            label._id && setId(label._id)
                                            setKey(label.key)
                                            setName(label.name)
                                        }}
                                        className="text-sm cursor-pointer"
                                    >
                                        {label.name}

                                    </Badge>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (label._id) {
                                                        setOpen(true)
                                                        setId(label._id)
                                                    }
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            刪除
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                編輯
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                {mode && (
                    <>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-3">
                            <ControlledInput
                                label="鍵值"
                                remark="實際篩選時的 ID 值"
                                id="key"
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                            />
                            <ControlledInput
                                label="名稱"
                                remark="使用者看到的名稱"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button type="submit">
                                    {mode == "put" ? "編輯" : "新增"}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </form>
            <DialogDoubleCheck 
                title="確定要刪除這個標籤嗎？"
                doFunction={handleDelete}
                server={true}
            />
        </div>
    );
}

export default FormLabel;