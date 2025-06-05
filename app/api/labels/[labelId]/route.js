import connect from "@/lib/db"
import Label from "@/models/Label"
import { Response } from "@/lib/utils"

export const DELETE = async (request, { params }) => {
    const { labelId } = params

    const { setStatus, setResponse, getResponse } = Response()

    // Fetch
    try {
        // From utils/db.js
        await connect()
        await Label.findByIdAndDelete(labelId)

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Label has been deleted.",
        })
    } catch (err) {
        console.error("Error deleting Label record:", err);

        setStatus(500)
        setResponse({
            status: false,
            type: "error",
            message: "Label deleted failed.",
        })
    }

    return getResponse();
}

export const PUT = async (request, { params }) => {
    const { labelId } = params

    const { setStatus, setResponse, getResponse } = Response()

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

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Label has been updated.",
        })
    } catch (err) {
        console.error("Error updating Label record:", err);

        setStatus(500)
        setResponse({
            status: false,
            type: "error",
            message: "Label update failed.",
        })
    }

    return getResponse();
}