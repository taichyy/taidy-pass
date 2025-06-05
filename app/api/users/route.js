import bcrypt from "bcryptjs"
import CryptoJS from "crypto-js"
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers"

import connect from "@/lib/db"
import User from "@/models/User"
import { Response, MAX_AGE } from "@/lib/utils"

// Create a new user.
export const POST = async (request) => {
    await connect();

    const jwtSecret = process.env.JWT_SECRET || "";
    const secret = process.env.USER_SECRET || "";

    const { setStatus, setResponse, getResponse } = Response()

    const body = await request.json();
    const { username, password, email } = body;

    // 加密 username 與 email
    const encryptedEmail = CryptoJS.AES.encrypt(email, secret).toString();
    const encryptedUsername = CryptoJS.AES.encrypt(username, secret).toString();
    const usernameHash = CryptoJS.SHA256(username, secret).toString();
    const passwordHash = await bcrypt.hash(password, 12);

    try {
        const existingUser = await User.findOne({ usernameHash });

        if (existingUser) {
            setStatus(200);
            setResponse({
                status: true,
                type: "user",
                message: "User already exists",
                data: null,
            })
            return getResponse()
        }

        const newUser = new User({
            usernameEncrypted: encryptedUsername,
            usernameHash,
            password: passwordHash,
            email: encryptedEmail,
            secondFAPassword: passwordHash,
            role: "user",
        });

        const savedUser = await newUser.save();

        const token = sign(
            {
                userId: savedUser._id,
                username,
                email,
                role: savedUser.role,
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

        setStatus(201);
        setResponse({
            status: true,
            type: "success",
            message: "Registration successful",
        })
    } catch (error) {
        console.error("[REGISTER_ERROR]", error);
        
        setStatus(500);
        setResponse({
            status: false,
            message: "Registration failed, please try again.",
        })
    }

    return getResponse()
};