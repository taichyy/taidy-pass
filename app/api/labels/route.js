import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import connect from "@/lib/db"
import Label from "@/models/Label"

export const POST = async (request) => {
    // POST /api/labels => create a new label
    // POST /api/labels?method=get => get all labels

    // Always check this
    const jwtSecret = process.env.JWT_SECRET || "";

    // Parse userId from token, or by Bearer header
    const token = cookies().get("token")?.value || request.headers.get("Authorization")?.split(" ")[1]
    const decoded = await jwtVerify(token, new TextEncoder().encode(jwtSecret))
    const userId = decoded.payload.userId
    const role = decoded.payload.role

    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    const url = new URL(request.url)
    const method = url.searchParams.get("method")
    // system or custom
    const type = url.searchParams.get("type")

    if (method === "get") {
        // GET /api/labels?method=get => get all labels
        try {
            await connect()
    
            const labels = await Label.find(type == "custom" ? { userId } : {});

            status = 200
            response.status = true
            response.type = "success"
            response.message = "Label fetched successfully"
            response.data = labels
        } catch (error) {
            console.error("Error fetching label records:", error);

            status = 500
            response.status = false
            response.message = "Label record fetching error."

            return NextResponse.json(
                response,
                { status }
            )
        }
    } else if ( !method ) {
        if (role !== "admin") {
            status = 401
            response.status = false
            response.type = "unauthorized"
            response.message = "Permission denied."
        } else {
            // POST /api/labels => create a new label
            // This is encrypted data, by user at client.
            const body = await request.json()
            const { key, name } = body
    
            const data = {
                key,
                name,
            }
        
            const newlabel = new Label(data)
        
            // Fetch
            try {
                // From utils/db.js
                await connect()
    
                // Check if label key already exists
                const existingLabel = await Label.findOne({ key })
    
                if (existingLabel) {
                    status = 400
                    response.status = false
                    response.type = "duplicated"
                    response.message = "Label key already exists."
                    return NextResponse.json(
                        response,
                        { status }
                    )
                }
    
                await newlabel.save()
        
                status = 200
                response.status = true
                response.type = "success"
                response.message = "Label has been created"
            } catch (error) {
                console.error("Error creating label records:", error);
    
                status = 500
                response.status = false
                response.message = "Label record creating error."
    
                return NextResponse.json(
                    response,
                    { status }
                )
            }
        }
    }

    return NextResponse.json(
        response,
        { status }
    )
}