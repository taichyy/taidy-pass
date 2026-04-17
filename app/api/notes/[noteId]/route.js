import connect from "@/lib/db"
import Note from "@/models/Note"
import { Response } from "@/lib/utils"
import { getUserId, apiProtect } from "@/lib/actions"

// PUT /api/notes/[noteId]  (body already encrypted by client)
export const PUT = async (request, props) => {
    const { getCheckResult } = await apiProtect()
    const valid = await getCheckResult()

    const { setStatus, setResponse, getResponse } = Response()

    if (!valid) {
        setStatus(403)
        setResponse({ status: false, message: "Access denied." })
        return getResponse()
    }

    const loginedUserId = await getUserId()
    const params = await props.params
    const { noteId } = params

    try {
        await connect()

        const note = await Note.findById(noteId)
        if (!note) {
            setStatus(404)
            setResponse({ status: false, type: "error", message: "Note not found." })
            return getResponse()
        }

        if (note.userId !== loginedUserId) {
            setStatus(403)
            setResponse({
                status: false,
                type: "error",
                message: "You are not authorized to access this note.",
            })
            return getResponse()
        }

        const body = await request.json()
        const { title = "", context = "" } = body || {}

        await Note.findByIdAndUpdate(noteId, {
            title,
            context,
        })

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Note has been updated.",
        })
    } catch (err) {
        console.error("Error updating note:", err)
        setStatus(500)
        setResponse({ status: false, type: "error", message: "Note update failed." })
    }

    return getResponse()
}

// DELETE /api/notes/[noteId]
export const DELETE = async (request, props) => {
    const { getCheckResult } = await apiProtect()
    const valid = await getCheckResult()

    const { setStatus, setResponse, getResponse } = Response()

    if (!valid) {
        setStatus(403)
        setResponse({ status: false, message: "Access denied." })
        return getResponse()
    }

    const loginedUserId = await getUserId()
    const params = await props.params
    const { noteId } = params

    try {
        await connect()

        const note = await Note.findById(noteId)
        if (!note) {
            setStatus(404)
            setResponse({ status: false, type: "error", message: "Note not found." })
            return getResponse()
        }

        if (note.userId !== loginedUserId) {
            setStatus(403)
            setResponse({
                status: false,
                type: "error",
                message: "You are not authorized to access this note.",
            })
            return getResponse()
        }

        await Note.findByIdAndDelete(noteId)

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Note has been deleted.",
        })
    } catch (err) {
        console.error("Error deleting note:", err)
        setStatus(500)
        setResponse({ status: false, type: "error", message: "Note delete failed." })
    }

    return getResponse()
}
