import CryptoJS from "crypto-js";
import { verify, sign } from "jsonwebtoken";
import { cookies } from "next/headers";

import connect from "@/lib/db"
import User from "@/models/User"
import { Response, MAX_AGE } from "@/lib/utils"
import { getUserId, apiProtect } from "@/lib/actions"

export const GET = async (request, props) => {
    // ----- General api check.
    // Auth helpers
    const { getCheckResult } = await apiProtect()
    const valid = await getCheckResult()

    // Response helpers
    const { setStatus, setResponse, getResponse } = Response()

    // Auth check
    if (!valid) {
        setStatus(403)
        setResponse({
            status: false,
            message: "Access denied.",
        })
        return getResponse();
    }

    const params = await props.params;
    const { userId } = params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const loginedUserId = await getUserId()

    if (loginedUserId !== userId) {
        setStatus(403)
        setResponse({
            status: false,
            type: "user",
            message: "You are not authorized to access this user.",
        })
    } else {
        if (type === 'email-check') {
            try {
                await connect();
                const user = await User.findById(userId);
                
                if (!user) {
                    setStatus(404);
                    setResponse({
                        status: false,
                        message: "用戶不存在",
                    });
                    return getResponse();
                }
                
                const cookieStore = await cookies();
                const token = cookieStore.get("token")?.value;
        
                if (!token) {
                    setStatus(401);
                    setResponse({
                        status: false,
                        message: "未登入",
                    });
                    return getResponse();
                }
        
                const jwtSecret = process.env.JWT_SECRET || "";
                const decoded = verify(token, jwtSecret);

                setStatus(200);
                setResponse({
                    status: true,
                    data: {
                        emailVerified: !!user.emailVerified,
                        email: decoded.email,
                    },
                });

            } catch (err) {
                console.error("Error checking user email verified status", err);

                setStatus(500);
                setResponse({
                    status: false,
                    message: "User email verification check failed.",
                });
            }
        } else {
            try {
                await connect()
                const user = await User.findById(userId)

                if (!user) {
                    setStatus(404)
                    setResponse({
                        status: false,
                        type: "user",
                        message: "User not found.",
                    })
                } else {
                    setStatus(200)
                    setResponse({
                        status: true,
                        type: "success",
                        message: "User found.",
                        data: user,
                    })
                }
            } catch (err) {
                console.error("Error fetching User record:", err);

                setStatus(500)
                setResponse({
                    status: false,
                    type: "error",
                    message: "User fetch failed.",
                })
            }
        }
    }

    return getResponse()
}

export const PATCH = async (request, props) => {
    // ----- General api check.
    // Auth helpers
    const { getCheckResult } = await apiProtect()
    const valid = await getCheckResult()

    // Response helpers
    const { setStatus, setResponse, getResponse } = Response()

    // Auth check
    if (!valid) {
        setStatus(403)
        setResponse({
            status: false,
            message: "Access denied.",
        })
        return getResponse();
    }

    const params = await props.params;
    const { userId } = params

    const body = await request.json()

    // Construct a dynamic update object
    const updateData = {};
    const fields = ["keyGenerated"];
    fields.forEach((field) => {
        if (body[field] !== undefined) {
            updateData[field] = body[field];
        }
    });

    // Handle email update
    if (body.email !== undefined) {
        const secret = process.env.USER_SECRET || "";
        const jwtSecret = process.env.JWT_SECRET || "";

        const newEmail = body.email.trim().toLowerCase();

        // Encrypt and store new email, reset verification status
        updateData.email = CryptoJS.AES.encrypt(newEmail, secret).toString();
        updateData.emailVerified = null;

        // Fetch current user data to rebuild JWT payload
        await connect();
        const user = await User.findById(userId);
        if (!user) {
            setStatus(404);
            setResponse({ status: false, message: "User not found." });
            return getResponse();
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            setStatus(401);
            setResponse({ status: false, message: "Not logged in." });
            return getResponse();
        }

        const decoded = verify(token, jwtSecret);

        // Fetch
        try {
            await User.findByIdAndUpdate(userId, updateData);

            // Re-issue JWT with updated email
            const newToken = sign(
                {
                    userId: decoded.userId,
                    username: decoded.username,
                    email: newEmail,
                    role: decoded.role,
                },
                jwtSecret,
                { expiresIn: MAX_AGE }
            );

            (await cookies()).set("token", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: MAX_AGE,
            });

            setStatus(200);
            setResponse({
                status: true,
                type: "email_updated",
                message: "Email updated successfully.",
            });
        } catch (err) {
            console.error("Error updating email:", err);
            setStatus(500);
            setResponse({ status: false, message: "Email update failed." });
        }

        return getResponse();
    }

    // Fetch
    try {
        // From utils/db.js
        await connect()
        await User.findByIdAndUpdate(userId, updateData)

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "User has been updated.",
        })
    } catch (err) {
        console.error("Error updating User record:", err);

        setStatus(500)
        setResponse({
            status: false,
            type: "error",
            message: "User update failed.",
        })
    }

    return getResponse();
}