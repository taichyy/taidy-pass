"use client"
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginForm() {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const username = form['username'].value
        const password = form['password'].value

        if (!username || !password) {
            !username && toast.error('請輸入帳號')
            !password && toast.error('請輸入密碼')
            return
        }

        const data = { username, password }

        try {
            const req = await fetch('/api/login', {
                body: JSON.stringify(data),
                method: "POST"
            })

            const { state, token } = await req.json()

            if (state === true && token) {
                // Set token in cookie
                document.cookie = `token=${token}; path=/; secure; SameSite=Strict`
                toast.success('登入成功')
                router.push('/')
            } else {
                toast.error('帳號或密碼錯誤')
                router.push('/login')
            }
        } catch (error) {
            console.error(error)
            toast.error('發生錯誤，請稍後再試')
        }
    }

    const inputs = [
        {
            id: 'username',
            type: 'text',
            label: '帳號',
            placeholder: '請輸入帳號',
        },
        {
            id: 'password',
            type: 'password',
            label: '密碼',
            placeholder: '請輸入密碼',
        }
    ]

    useEffect(() => {
        setIsMounted(true)
    }, [])
    if (!isMounted) {
        return null
    }

    return (
        <Card className="w-full relative">
            <CardHeader>
                <CardTitle>太成網</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="flex w-full flex-col gap-2 items-center">
                        {inputs.map((input, index) => (
                            <div className="flex flex-col space-y-1 w-full" key={index}>
                                <Label htmlFor={input.id} className='text-base'>{input.label}</Label>
                                <Input id={input.id} type={input.type} placeholder={input.placeholder} />
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-end">
                    <Button className='text-lg' type="submit">登入</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
