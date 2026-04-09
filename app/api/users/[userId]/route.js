import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

import connect from "@/lib/db"
import User from "@/models/User"
import { Response } from "@/lib/utils"
import { getUserId } from "@/lib/actions"

export const GET = async (request, props) => {
    const params = await props.params;
    const { userId } = params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const { setStatus, setResponse, getResponse } = Response()

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
    const params = await props.params;
    const { userId } = params

    const body = await request.json()

    const { setStatus, setResponse, getResponse } = Response()

    // Construct a dynamic update object
    const updateData = {};
    const fields = ["keyGenerated"];
    fields.forEach((field) => {
        if (body[field] !== undefined) {
            updateData[field] = body[field];
        }
    });

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