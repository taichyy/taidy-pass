import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

import connect from "@/lib/db"
import User from "@/models/User";
import { Response, MAX_AGE } from "@/lib/utils"
import { getUserId } from "@/lib/actions";

// Login
export const POST = async (request) => {
    await connect();

    const jwtSecret = process.env.JWT_SECRET || "";
    const secret = process.env.USER_SECRET || "";

    const { setStatus, setResponse, getResponse } = Response()

    const body = await request.json();
    const { username, password } = body;

    const usernameHash = CryptoJS.SHA256(username, secret).toString();

    try {
        const user = await User.findOne({ usernameHash });

        if (!user) {
            setStatus(401);
            setResponse({
                status: false,
                type: "user",
                message: "User does not exist",
                data: null,
            })
            return getResponse();
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            setStatus(401);
            setResponse({
                status: false,
                type: "password",
                message: "Password is incorrect",
                data: null,
            });
            return getResponse();
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

        (await cookies()).set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: MAX_AGE,
        });

        setStatus(200);
        setResponse({
            status: true,
            type: "user",
            message: "Login successful",
            data: {
                token,
                salt: user.salt,
            },
        })
    } catch (error) {
        console.error("[LOGIN_ERROR]", error);

        setStatus(500);
        setResponse({
            status: false,
            message: "Server error during login",
        });
    }

    return getResponse();
};

// Logout
export async function DELETE(request) {
    const cookieStore = await cookies();

    const { setStatus, setResponse, getResponse } = Response()

    // Update tokenValidAfter to invalidate existing tokens
    const token = cookieStore.get("token")?.value;
    if (token) {
        try {
            const userId = await getUserId();

            await User.findByIdAndUpdate(userId, { tokenValidAfter: new Date() });
        } catch (error) {
            console.error("[LOGOUT_ERROR]", error);
            // Even if token verification fails, we still want to clear the cookie
        }
    }   

    // Clear the token cookie
    cookieStore.set("token", "", {
        path: "/",
        httpOnly: true,
        // Expire immediately
        expires: new Date(0), 
    });

    setStatus(200);
    setResponse({
        status: true,
        message: "Logout successfully",
    })

    return getResponse();
}