"use client"
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { useKey } from "@/components/providers/provider-key";
import UncontrolledInput from "@/components/uncontrolled-input";

const FormDeleteKeychain = ({
    keychainName,
    keychainId,
    mutate,
    setOpened,
}: {
    keychainName: string,
    keychainId: string;
    mutate?: () => void;
    setOpened: (opened: boolean) => void;
}) => {
    const { salt } = useKey()

    const [loading, setLoading] = useState(false);

    const inputs = [
        {
            id: "name",
            type: "text",
            label: "鑰匙圈名稱",
            placeholder: `如果確認要刪除鑰匙圈，請輸入鑰匙圈名稱「${keychainName}」來確認`,
        },
        {
            id: "password",
            type: "text",
            label: "登入密碼",
            placeholder: "請輸入您的登入密碼以確認",
        },
    ]

    // For Add and edit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        if (loading) {
            return;
        }

        setLoading(true)
        e.preventDefault()

        if (!salt) {
            toast.error("無法取得加密鹽值，請重新登入");
            setLoading(false);
            return;
        }

        if (!e.target) {
            toast.error("表單提交失敗，請稍後再試");
            setLoading(false);
            return;
        }

        const url = `/api/keychains/${keychainId}`
        const method = "DELETE"

        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value
        const password = (form.elements.namedItem("password") as HTMLInputElement).value

        if (name !== keychainName) {
            toast.error(`鑰匙圈名稱不正確，請輸入「${keychainName}」以確認刪除`);
            setLoading(false);
            return;
        }

        try {
            const req = await axios({
                method,
                url,
                data: JSON.stringify({
                    password,
                })
            })

            const res = req.data

            console.log(res)
            toast.success("刪除成功")
            setOpened(false)
            mutate && mutate()
        } catch (err) {
            let errorMessage = "刪除失敗，請稍後再試";

            if (err instanceof AxiosError) {
                const res = err.response?.data;
                const type = res?.type;

                switch (type) {
                    case "password":
                        errorMessage = "密碼錯誤，請確認您的登入密碼";
                        break;
                    case "user":
                        errorMessage = "用戶不存在或登入憑證錯誤，請重新登入";
                        break;
                    case "keychain":
                        errorMessage = "鑰匙圈不存在或已被刪除，請確認鑰匙圈 ID 是否正確";
                        break;
                }
            }

            toast.error(errorMessage);
            console.error("Error deleting keychain:", err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="text-left flex flex-col gap-3">
            {inputs.map((input) => (
                <UncontrolledInput
                    key={input.id}
                    id={input.id}
                    type={input.type as "text" | "email" | "password" | "textarea"}
                    label={input.label}
                    placeholder={input.placeholder}
                    required
                />
            ))}
            <div className=" flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={() => {
                        setOpened(false);
                    }}
                >
                    取消
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    variant={loading ? "secondary" : "destructive"}
                >
                    刪除
                </Button>
            </div>
        </form>
    );
}

export default FormDeleteKeychain;