import { sign } from "jsonwebtoken";

const MAX_AGE = 60 * 60 * 24 * 14; // days;

export async function POST(request) {

    // Login info
    const authAccount = process.env.LOGIN_ACCOUNT
    const authPassword = process.env.LOGIN_PASSWORD

    // Get data
    const body = await request.json();
    const { username, password } = body;

    // Always check this
    const secret = process.env.JWT_SECRET || "";

    // Message to response
    let response = {
        msg: null,
    };

    // Check if empty
    if (username == "") {
        response.state = false
        response.msg = "請輸入帳號"

        return new Response(JSON.stringify(response), {
            status: 200,
        });
    } else if (password == "") {
        response.state = false
        response.msg = "請輸入密碼"

        return new Response(JSON.stringify(response), {
            status: 200,
        });
    }

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