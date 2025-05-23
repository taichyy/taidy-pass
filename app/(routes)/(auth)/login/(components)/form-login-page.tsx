"use client"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { deriveRawKey } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import UncontrolledInput from "@/components/uncontrolled-input"
import { useKey } from "@/components/providers/provider-key"

export default function FormLoginPage({
    mode = "login",
}: {
    mode?: "register" | "login"
}) {
    const router = useRouter()

    const { setSalt, setKey } = useKey()
    const [isLoading, setIsLoading] = useState(false)

    const formMode = mode || "login"

    const apiUrl = formMode == "register" ? "/api/users" : "/api/session"
    const successUrl = formMode == "register" ? "/onboarding" : "/vault"
    const texts = formMode == "register" ? {
        href: "/login?mode=login",
        linkDesc: "已經有帳號了？",
        linkBtn: "登入",
        button: "註冊",
        apiSuccess: "註冊成功",
        apiError: "註冊失敗",
    } : {
        href: "login?mode=register",
        linkDesc: "還沒有帳號嗎？",
        linkBtn: "註冊",
        button: "登入",
        apiSuccess: "登入成功",
        apiError: "登入失敗",
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const form = e.target as HTMLFormElement
        const email = form['email']?.value
        const username = form['username'].value
        const password = form['password'].value
        const confirmPassword = form['confirm-password']?.value

        // Val check
        if (formMode == "register" && password !== confirmPassword) {
            toast.error('密碼不一致')
            setIsLoading(false)
            return
        }

        if (!username || !password) {
            toast.error('請填寫所有欄位')
            setIsLoading(false)
            return
        }

        const body: any = {
            username,
            password,
        }
        if (formMode == "register") {
            body.email = email
        }

        try {
            const req = await fetch(apiUrl, {
                body: JSON.stringify(body),
                method: "POST"
            })

            const res = await req.json()
            const { status, type, data } = res || {}
            const { salt } = data || {}

            if (status) {
                if (formMode == "register") {
                    if (type == "user") {
                        toast.error("使用者已存在")
                    } else {
                        toast.success(texts.apiSuccess)
                        router.push(successUrl)
                    }
                } else if (formMode == "login") {
                    setSalt(salt)

                    const key = await deriveRawKey(password, salt) as unknown as string

                    console.log(key)
                    setKey(key)

                    toast.success(texts.apiSuccess)
                    router.push(successUrl)
                }
            } else {
                let msg = ""
                if (formMode == "register") {
                    if (type == "database") {
                        msg = "註冊失敗，請稍後再試"
                    } else {
                        msg = "註冊失敗，請稍後再試"
                    }
                } else if (formMode == "login") {
                    if (type == "password") {
                        msg = "密碼錯誤"
                    } else if (type == "user") {
                        msg = "使用者不存在"
                    }
                }

                toast.error(msg)
            }
        } catch (error) {
            console.error(error)
            toast.error(texts.apiError)
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className=" text-slate-800 flex flex-col justify-between w-full">
            <div className="flex flex-col gap-3">
                <div className="flex w-full flex-col gap-3 items-center">
                    <UncontrolledInput
                        label="使用者名稱"
                        remark="這將會是您的登入帳號"
                        id="username"
                        type="text"
                    />
                    {formMode == "register" && (
                        <UncontrolledInput
                            label="電子信箱"
                            id="email"
                            type="email"
                        />
                    )}
                    <UncontrolledInput
                        label="密碼"
                        id="password"
                        type="text"
                    />
                    {formMode == "register" && (
                        <UncontrolledInput
                            label="確認密碼"
                            id="confirm-password"
                            type="text"
                            placeholder="請再次輸入密碼"
                        />
                    )}
                </div>
                <span className="text-sm text-slate-500">
                    {texts.linkDesc}
                    <Link href={texts.href} className="text-primary/70 hover:underline">
                        {texts.linkBtn}
                    </Link>
                </span>
            </div>
            <div className="flex flex-col items-end my-6 md:mt-0">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "載入中" : texts.button}
                </Button>
            </div>
        </form>
    )
}