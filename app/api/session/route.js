import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import connect from "@/lib/db"
import User from "@/models/User";

const MAX_AGE = 60 * 60 * 24 * 14; // days;

// Login
export const POST = async (request) => {
    await connect();

    const jwtSecret = process.env.JWT_SECRET || "";
    const secret = process.env.USER_SECRET || "";

    // Message to response
    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    const body = await request.json();
    const { username, password } = body;

    const usernameHash = CryptoJS.SHA256(username, secret).toString();

    try {
        const user = await User.findOne({ usernameHash });

        if (!user) {
            status = 401;
            response = {
                status: false,
                type: "user",
                message: "使用者不存在",
                data: null,
            };
            return NextResponse.json(response, { status });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            status = 401;
            response = {
                status: false,
                type: "password",
                message: "密碼錯誤",
                data: null,
            };
            return NextResponse.json(response, { status });
        }

        const decryptedEmail = CryptoJS.AES.decrypt(user.email, secret).toString(CryptoJS.enc.Utf8);
        const decryptedUsername = CryptoJS.AES.decrypt(user.usernameEncrypted, secret).toString(CryptoJS.enc.Utf8);

        const token = sign(
            {
                userId: user._id,
                username: decryptedUsername,
                email: decryptedEmail,
                role: user.role,
            },
            jwtSecret,
            {
                expiresIn: MAX_AGE,
            }
        );

        cookies().set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: MAX_AGE,
        });

        status = 200;
        response = {
            status: true,
            type: "user",
            message: "登入成功",
            data: { 
                token,
                salt: user.salt,
            },
        };
    } catch (error) {
        console.error("[LOGIN_ERROR]", error);
        status = 500;
        response.message = "發生錯誤，請稍後再試";
    }

    return NextResponse.json(response, { status });
};

// Logout
export async function DELETE(request) {
    const cookieStore = cookies();

    // Message to response
    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    cookieStore.set("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // Expire immediately
    });

    status = 200
    response.status = true
    response.message = "Logout successfully"

    return NextResponse.json(
        response,
        { status }
    )
}