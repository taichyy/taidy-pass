import CryptoJS from "crypto-js"
import { NextResponse } from "next/server"

import connect from "@/lib/db"
import Account from "@/models/Account"

export const GET = async (request) => {
    try {
        await connect()

        const accounts = await Account.find()

        const parsedAccounts = accounts.map((account) => {
            return {
                ...account,
                _id: account._id,
                type: account.type,
                title: CryptoJS.AES.decrypt(account.title, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
                username: CryptoJS.AES.decrypt(account.username, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
                password: CryptoJS.AES.decrypt(account.password, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
            };
        });

        return new NextResponse(JSON.stringify(parsedAccounts), {
            status: 200
        })
    } catch (error) {
        return new NextResponse("Error fetching: " + error, {
            status: 500
        })
    }
}

export const POST = async (request) => {

    const body = await request.json()

    const encryptedTitle = CryptoJS.AES.encrypt(body.title, process.env.DATA_KEY).toString()
    const encryptedUsername = CryptoJS.AES.encrypt(body.username, process.env.DATA_KEY).toString()
    const encryptedPassword = CryptoJS.AES.encrypt(body.password, process.env.DATA_KEY).toString()

    const data = {
        title: encryptedTitle,
        username: encryptedUsername,
        password: encryptedPassword,
        type: body.type,
    }

    const newAccount = new Account(data)

    // Fetch
    try {
        // From utils/db.js
        await connect()
        await newAccount.save()

        return new NextResponse("Account has been created", {
            status: 201
        })
    } catch (err) {
        return new NextResponse("Database Error", {
            status: 500,
        })
    }
}