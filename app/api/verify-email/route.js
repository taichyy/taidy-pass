import { cookies } from "next/headers";
import { verify, sign } from "jsonwebtoken";

import connect from "@/lib/db";
import User from "@/models/User";
import { Response } from "@/lib/utils";
import { apiProtect } from "@/lib/actions";

export async function POST(request) {
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


    await connect();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            setStatus(401);
            setResponse({
                status: false,
                message: "Not logined.",
            });
            return getResponse();
        }
        
        const jwtSecret = process.env.JWT_SECRET || "";
        const decoded = verify(token, jwtSecret);
        const userId = decoded.userId;
        
        // Generate JWT token, including user id and email.
        const verificationToken = sign(
            {
                userId: userId,
                type: 'email_verification',
                email: decoded.email,
            },
            jwtSecret,
            { expiresIn: '10m' }
        );
        
        if (verificationToken) {
            // For prod, sned email
            // For dev, send the token to front end.
            if (process.env.NEXT_PUBLIC_ENV == "PROD") {
                const origin =
                    process.env.NEXT_PUBLIC_API_URL ||
                    (request?.url ? new URL(request.url).origin : null) ||
                    `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("x-forwarded-host") || request.headers.get("host")}`;
                    
                const verifyUrl = `${origin}/vault?verify=${verificationToken}`;
                
                // Send email here.
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/email`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            email: decoded.email,
                            username: decoded.username,
                            content: `
                                <p>請點擊以下連結以驗證您的 Email 信箱：</p>
                                <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
                                <p>此連結有效期限為 10 分鐘。</p>
                            `,
                        }),
                    }
                )

                if (res.ok) {
                    setStatus(200);
                    setResponse({
                        status: true,
                        message: "Email sent successfully.",
                    });
                } else {
                    setStatus(500);
                    setResponse({
                        status: false,
                        message: "Failed to send verification email.",
                    });
                }
            } else if (process.env.NEXT_PUBLIC_ENV == "DEV") {
                res.verificationToken = verificationToken;

                setStatus(200);
                setResponse({
                    status: true,
                    message: "Token sent successfully.",
                    verificationToken: verificationToken
                });
            }
        } else {
            setStatus(500)
            setResponse({
                status: false,
                message: "Verification token generation failed."
            })
        }
    } catch (error) {
        console.error("[GENERATE_VERIFICATION_ERROR]", error);
        setStatus(500);
        setResponse({
            status: false,
            message: "Server error.",
        });
    }

    return getResponse();
}

// Verify email through JWT token
export async function GET(request) {
    await connect();

    const { setStatus, setResponse, getResponse } = Response();

    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            setStatus(400);
            setResponse({
                status: false,
                message: "Token required.",
            });
            return getResponse();
        }

        const jwtSecret = process.env.JWT_SECRET || "";
        
        // Verify JWT token
        const decoded = verify(token, jwtSecret);
        
        if (decoded.type !== 'email_verification') {
            setStatus(400);
            setResponse({
                status: false,
                message: "Wrong token",
            });
            return getResponse();
        }

        const userId = decoded.userId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            setStatus(404);
            setResponse({
                status: false,
                message: "User not exists",
            });
            return getResponse();
        }

        // Check if has been verified.
        if (user.emailVerified) {
            setStatus(200);
            setResponse({
                status: true,
                message: "Email verified.",
            });
            return getResponse();
        }

        // Update user verification status
        await User.findByIdAndUpdate(userId, {
            emailVerified: new Date(),
        });

        setStatus(200);
        setResponse({
            status: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            setStatus(400);
            setResponse({
                status: false,
                message: "Token expired or wrong.",
            });
        } else {
            console.error("[VERIFY_EMAIL_GET_ERROR]", error);
            setStatus(500);
            setResponse({
                status: false,
                message: "Server error.",
            });
        }
    }

    return getResponse();
}