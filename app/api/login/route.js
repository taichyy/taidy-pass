import CryptoJS from "crypto-js";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

import connect from "@/lib/db"
import Account from "@/models/Account";

const MAX_AGE = 60 * 60 * 24 * 14; // days;

export async function POST(request) {
    let keyAccounts = []

    // Check if there is a key account
    try {
        await connect();
    
        // Find accounts where type is "key"
        const accounts = await Account.find({ type: "key" });

        keyAccounts = accounts.map((account) => {
            return {
                ...account.toObject(), // Ensure it's a plain object
                _id: account._id,
                title: CryptoJS.AES.decrypt(account.title, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
                username: CryptoJS.AES.decrypt(account.username, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
                password: CryptoJS.AES.decrypt(account.password, process.env.DATA_KEY).toString(CryptoJS.enc.Utf8),
            };
        });
    
    } catch (error) {
        return new NextResponse("Error fetching key account: " + error, {
            status: 500
        });
    }

    // Login info
    const authAccount = keyAccounts?.[0]?.username || process.env.DEFAULT_LOGIN_ACCOUNT || ""
    const authPassword = keyAccounts?.[0]?.username || process.env.DEFAULT_LOGIN_PASSWORD || ""

    // Get data
    const body = await request.json();
    const { username, password } = body;

    // Always check this
    const secret = process.env.JWT_SECRET || "";

    // Message to response
    let response = {
        msg: null,
    };

    // Get users from database
    if (username == authAccount && password == authPassword) {
        // Get token
        const token = sign({
            username,
        }, secret, {
            expiresIn: MAX_AGE,
        });

        response.state = true
        response.msg = "登入成功"
        response.token = token
        return new Response(JSON.stringify(response), {
            status: 200,
        });
    }

    response.state = false
    response.msg = "發生錯誤，請稍後再試"
    return new Response(JSON.stringify(response), {
        status: 200,
    });
}