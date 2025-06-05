import connect from "@/lib/db"
import User from "@/models/User"
import { Response } from "@/lib/utils"
import { getUserId } from "@/lib/actions"

export const GET = async (request, { params }) => {
    const { userId } = params

    const loginedUserId = await getUserId(request)

    const { setStatus, setResponse, getResponse } = Response()

    if (loginedUserId !== userId) {
        setStatus(403)
        setResponse({
            status: false,
            type: "user",
            message: "You are not authorized to access this user.",
        })
    } else {
         // Fetch
        try {
            // From utils/db.js
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

    return getResponse()
}

export const PATCH = async (request, { params }) => {
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