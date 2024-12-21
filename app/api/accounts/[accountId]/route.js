import CryptoJS from "crypto-js"
import { NextResponse } from "next/server"

import connect from "@/lib/db"
import Account from "@/models/Account"

export const GET = async (request, { params }) => {
    const { accountId } = params

    // Fetch
    try {
        // From utils/db.js
        await connect()
        const account = await Account.findById(accountId)

        const data = {
            _id: account._id,
            title: CryptoJS.AES.decrypt(account.title, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
            username: CryptoJS.AES.decrypt(account.username, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
            password: CryptoJS.AES.decrypt(account.password, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
        }

        return new NextResponse(JSON.stringify(data), {
            status: 200
        })
    } catch (err) {
        return new NextResponse("Database Error", {
            status: 500,
        })
    }
}

export const DELETE = async (request, { params }) => {

    const { accountId } = params

    // Fetch
    try {
        // From utils/db.js
        await connect()
        await Account.findByIdAndDelete(accountId)

        return new NextResponse("Account has been deleted", {
            status: 200
        })
    } catch (err) {
        return new NextResponse("Database Error", {
            status: 500,
        })
    }
}

export const PUT = async (request, { params }) => {

    const { accountId } = params
    const body = await request.json()

    const encryptedTitle = CryptoJS.AES.encrypt(body.title, process.env.DATA_KEY).toString()
    const encryptedUsername = CryptoJS.AES.encrypt(body.username, process.env.DATA_KEY).toString()
    const encryptedPassword = CryptoJS.AES.encrypt(body.password, process.env.DATA_KEY).toString()

    const data = {
        title: encryptedTitle,
        username: encryptedUsername,
        password: encryptedPassword
    }

    // Fetch
    try {
        // From utils/db.js
        await connect()
        await Account.findByIdAndUpdate(accountId, data)

        return new NextResponse("Account has been updated", {
            status: 200
        })
    } catch (err) {
        return new NextResponse("Database Error", {
            status: 500,
        })
    }
}