import { NextResponse } from "next/server"

import connect from "@/lib/db"
import User from "@/models/User"
import { getUserId } from "@/lib/actions"

export const GET = async (request, { params }) => {
    const { userId } = params

    const loginedUserId = await getUserId(request)

    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    if (loginedUserId !== userId) {
        status = 403
        response.status = false
        response.type = "error"
        response.message = "You are not authorized to access this user." 
    } else {
         // Fetch
        try {
            // From utils/db.js
            await connect()
            const user = await User.findById(userId)

            if (!user) {
                status = 404
                response.status = false
                response.type = "error"
                response.message = "User not found."
            } else {
                status = 200
                response.status = true
                response.type = "success"
                response.message = "User found."
                response.data = user
            }
        } catch (err) {
            console.error("Error fetching User record:", err);

            status = 500
            response.status = false
            response.type = "error"
            response.message = "User fetch failed."
        }   
    }

    return NextResponse.json(
        response,
        { status }
    )
}

export const PATCH = async (request, { params }) => {
    const { userId } = params

    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    const body = await request.json()

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

        status = 200
        response.status = true
        response.type = "success"
        response.message = "User has been updated."
    } catch (err) {
        console.error("Error updating User record:", err);

        status = 500
        response.status = false
        response.type = "error"
        response.message = "User update failed."
    }

    return NextResponse.json(
        response,
        { status }
    )
}