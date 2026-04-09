const nodemailer = require('nodemailer');

import { Response } from "@/lib/utils"

export async function POST(request) {
    const body = await request.json();

    const { subject, email, username, content } = body || {}

    const { setStatus, setResponse, getResponse } = Response()

    if (!email) {
        setStatus(400)
        setResponse({
            status: false,
            message: "Email is required.",
        })

        return getResponse();
    }

    if (!content) {
        setStatus(400)
        setResponse({
            status: false,
            message: "Content is required.",
        })

        return getResponse();
    }

    const message = {
        from: `TaidyPass Team <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: subject || "TaidyPass Notification",
        html: `
            <p>
                Hello ${username},
            </p>

            ${content}
        `,
        headers: {
            "X-Entity-Ref-ID": "newmail",
        }
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false
        }
    })

    try {
        await transporter.sendMail(message);

        setStatus(200)
        setResponse({
            status: true,
            message: "Email sent successfully.",
        })
    } catch (error) {
        console.error("Error sending email:", error);

        setStatus(500)
        setResponse({
            status: false,
            message: "Email sending failed.",
        })
    } finally {
        return getResponse();
    }
}