"use server"
import CryptoJS from "crypto-js"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

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

export const getUserId = async (request?: any) => {
    // Always check this
    const jwtSecret = process.env.JWT_SECRET || "";

    // Parse userId from token
    let token = ""

    
    if (request) {
        const authHeader = request.headers.get("authorization")
        token = authHeader?.split(" ")[1] || ""
    } else {
        token = cookies().get("token")?.value || ""
    }

    const decoded = await jwtVerify(token || "", new TextEncoder().encode(jwtSecret))

    const userId = decoded.payload.userId

    return userId || ""
}