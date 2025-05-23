import { NextResponse } from "next/server"

import connect from "@/lib/db"
import Label from "@/models/Label"

export const DELETE = async (request, { params }) => {
    const { labelId } = params

    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    // Fetch
    try {
        // From utils/db.js
        await connect()
        await Label.findByIdAndDelete(labelId)

        status = 200
        response.status = true
        response.type = "success"
        response.message = "Label has been deleted."
    } catch (err) {
        console.error("Error deleting Label record:", err);

        status = 500
        response.status = false
        response.type = "error"
        response.message = "Label deleted failed."
    }

    return NextResponse.json(
        response,
        { status }
    )
}

export const PUT = async (request, { params }) => {
    const { labelId } = params

    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    const body = await request.json()
    const { key, name } = body

    const data = {
        key,
        name,
    }

    // Fetch
    try {
        await connect()

        await Label.findByIdAndUpdate(labelId, data)

        status = 200
        response.status = true
        response.type = "success"
        response.message = "Label has been updated."
    } catch (err) {
        console.error("Error updating Label record:", err);

        status = 500
        response.status = false
        response.type = "error"
        response.message = "Label update failed."
    }

    return NextResponse.json(
        response,
        { status }
    )
}