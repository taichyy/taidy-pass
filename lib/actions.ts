"use server"
import CryptoJS from "crypto-js"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

import connect from "./db"
import User from "@/models/User"
import { TAccount, TNote } from "./types"

export const encryptRecord = async (record: TAccount, key: string) => {
    const { title, username, password, remark } = record

    const encryptedTitle = CryptoJS.AES.encrypt(title, key).toString()
    const encryptedUsername = CryptoJS.AES.encrypt(username, key).toString()
    const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString()
    const encryptedRemark = remark ? CryptoJS.AES.encrypt(remark, key).toString() : ""

    return {
        ...record,
        title: encryptedTitle,
        username: encryptedUsername,
        password: encryptedPassword,
        remark: encryptedRemark
    }
}

export const encryptRecordNote = async (record: TNote, key: string) => {
    const { title, context } = record

    const encryptedTitle = title ? CryptoJS.AES.encrypt(title, key).toString() : ""
    const encryptedContext = context ? CryptoJS.AES.encrypt(context, key).toString() : ""

    return {
        ...record,
        title: encryptedTitle,
        context: encryptedContext,
    }
}

export const getUserId = async (request?: any): Promise<string> => {
    // Always check this
    const jwtSecret = process.env.JWT_SECRET || "";

    // Parse userId from token
    let token = ""
    
    if (request) {
        const authHeader = request.headers.get("authorization")
        token = authHeader?.split(" ")[1] || ""
    } else {
        token = (await cookies()).get("token")?.value || ""
    }

    const decoded = await jwtVerify(token || "", new TextEncoder().encode(jwtSecret))

    const userId = decoded.payload.userId

    return userId as string || ""
}

export const tokenIsValid = async (request?: any): Promise<boolean> => {
    try {
        // Always check this
        const jwtSecret = process.env.JWT_SECRET || "";

        // Already did basic check whild getting userId.
        const userId = await getUserId(request)

        await connect()
        
        // Fetch tokenValidAfter from database, and compare with token's iat (issued at) field.
        const user = await User.findById(userId)

        // Parse userId from token
        let token = ""
    
        if (request) {
            const authHeader = request.headers.get("authorization")
            token = authHeader?.split(" ")[1] || ""
        } else {
            token = (await cookies()).get("token")?.value || ""
        }

        if (!token) return false

        const decoded = await jwtVerify(token || "", new TextEncoder().encode(jwtSecret))
        const tokenIat = decoded?.payload.iat && new Date(decoded?.payload.iat * 1000) || new Date()

        if (user && user.tokenValidAfter < tokenIat) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

export const apiProtect = async () => {
    let roleList = ["admin", "user"]

    const adminOnly = () => roleList = ["admin"]

    const userOnly = () => roleList = ["user"]

    const getCheckResult = async (): Promise<boolean> => {
        // Always check this
        const jwtSecret = process.env.JWT_SECRET || "";

        const isValid = await tokenIsValid()

        const token = (await cookies()).get("token")?.value || ""

        if (!token) return false

        const decoded = await jwtVerify(token || "", new TextEncoder().encode(jwtSecret))
        const tokenRole: string = decoded?.payload.role as string || ""

        return isValid && roleList.includes(tokenRole)
    }

    return {
        adminOnly,
        userOnly,
        getCheckResult
    }
}