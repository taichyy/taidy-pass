// Vercel cron job: keeps the app warm by hitting the login endpoint every 29 days.
// Schedule is defined in vercel.json.
export const GET = async (request) => {
    // Verify the request comes from Vercel's cron scheduler
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response(JSON.stringify({ status: false, message: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
        const response = await fetch(`${baseUrl}/api/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "test", password: "test" }),
        });

        const data = await response.json();

        return new Response(
            JSON.stringify({
                status: true,
                message: "Ping login completed",
                loginResponse: data,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("[CRON_PING_LOGIN_ERROR]", error);

        return new Response(
            JSON.stringify({ status: false, message: "Cron ping failed", error: error.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};
