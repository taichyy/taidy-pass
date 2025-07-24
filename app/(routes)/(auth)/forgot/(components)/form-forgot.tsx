"use client"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { deriveRawKey } from "@/lib/utils"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useKey } from "@/components/providers/provider-key"
import UncontrolledInput from "@/components/uncontrolled-input"

export default function FormForgot() {
    const router = useRouter()

    const { setSalt, setKey } = useKey()
    const [isLoading, setIsLoading] = useState(false)

    const apiUrl = "/api/session"
    const successUrl = "/vault"
    const texts = {
        href: "/login?mode=login",
        button: "註冊",
        apiSuccess: "註冊成功",
        apiError: "註冊失敗",
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const form = e.target as HTMLFormElement
        const email = form['email']?.value
        const verificationPwd = form['verification-password'].value

        // Val check
        // if (formMode == "register" && password !== confirmPassword) {
        //     toast.error('密碼不一致')
        //     setIsLoading(false)
        //     return
        // }

        if (!email || !verificationPwd) {
            toast.error('請填寫所有欄位')
            setIsLoading(false)
            return
        }

        // const body: any = {
        //     username,
        //     password,
        // }
        // if (formMode == "register") {
        //     body.email = email
        // }

        try {
            const req = await fetch(apiUrl, {
                // body: JSON.stringify(body),
                method: "POST"
            })

            const res = await req.json()
            const { status, type, data } = res || {}
            const { salt } = data || {}

            if (status) {
                // if (formMode == "register") {
                //     if (type == "user") {
                //         toast.error("使用者已存在")
                //     } else {
                //         toast.success(texts.apiSuccess)
                //         router.push(successUrl)
                //     }
                // } else if (formMode == "login") {
                //     setSalt(salt)

                //     const key = await deriveRawKey(password, salt)
                //     setKey(key)

                //     toast.success(texts.apiSuccess)

                //     // Let the middlewares handle the redirect
                //     router.refresh()
                // }
            } else {
                let msg = ""
                // if (formMode == "register") {
                //     if (type == "database") {
                //         msg = "註冊失敗，請稍後再試"
                //     } else {
                //         msg = "註冊失敗，請稍後再試"
                //     }
                // } else if (formMode == "login") {
                //     if (type == "password") {
                //         msg = "密碼錯誤"
                //     } else if (type == "user") {
                //         msg = "使用者不存在"
                //     }
                // }

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
                        label="電子信箱"
                        id="email"
                        type="email"
                    />
                    <UncontrolledInput
                        label="圖形驗證碼                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "
                        id="verification-password"
                        type="text"
                    />
                </div>
            </div>
            <div className="flex flex-col items-end my-6 md:mt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "載入中" : texts.button}
                </Button>
            </div>
        </form>
    )
}