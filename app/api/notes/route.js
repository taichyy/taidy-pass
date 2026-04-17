import connect from "@/lib/db"
import Note from "@/models/Note"
import { Response } from "@/lib/utils"
import { USER_PLAN_LIMITS, isLimited } from "@/lib/limits"
import { getUserId, getUserRole, apiProtect } from "@/lib/actions"

// POST /api/notes              => create a new note (title/context already encrypted by client)
// POST /api/notes?method=get   => fetch all encrypted notes for user
// PUT  /api/notes?method=reorder => reorder { ids: [] }
export const POST = async (request) => {
    const { getCheckResult } = await apiProtect()
    const valid = await getCheckResult()

    const { setStatus, setResponse, getResponse } = Response()

    if (!valid) {
        setStatus(403)
        setResponse({ status: false, message: "Access denied." })
        return getResponse()
    }

    const userId = await getUserId()

    if (!userId) {
        setStatus(401)
        setResponse({ status: false, type: "user", message: "User not found." })
        return getResponse()
    }

    const url = new URL(request.url)
    const method = url.searchParams.get("method")

    await connect()

    if (method === "get") {
        try {
            const notes = await Note.find({ userId }).sort({ order: 1, createdAt: 1 }).lean()
            const data = notes.map((n) => ({
                _id: String(n._id),
                title: n.title || "",
                context: n.context || "",
                order: n.order ?? 0,
            }))

            setStatus(200)
            setResponse({
                status: true,
                type: "success",
                message: "Notes fetched successfully",
                data,
            })
        } catch (err) {
            console.error("Error fetching notes:", err)
            setStatus(500)
            setResponse({ status: false, message: "Note fetching error." })
        }
        return getResponse()
    }

    // Create
    try {
        const body = await request.json()
        const { title = "", context = "" } = body || {}

        // ----- Plan limit check (user role only)
        const role = await getUserRole()
        if (isLimited(role)) {
            const count = await Note.countDocuments({ userId })
            if (count >= USER_PLAN_LIMITS.notes) {
                setStatus(403)
                setResponse({
                    status: false,
                    type: "limit",
                    message: `便利貼數量已達方案上限（${USER_PLAN_LIMITS.notes} 張）。`,
                })
                return getResponse()
            }
        }

        // New note goes at the bottom (largest order + 1)
        const last = await Note.findOne({ userId }).sort({ order: -1 }).lean()
        const nextOrder = (last?.order ?? -1) + 1

        const newNote = new Note({
            userId,
            title,
            context,
            order: nextOrder,
        })
        await newNote.save()

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Note has been created",
            data: {
                _id: String(newNote._id),
                title,
                context,
                order: nextOrder,
            },
        })
    } catch (err) {
        console.error("Error creating note:", err)
        setStatus(500)
        setResponse({ status: false, message: "Note creating error." })
    }

    return getResponse()
}

// PUT /api/notes?method=reorder  => body { ids: [...] }
export const PUT = async (request) => {
    const { getCheckResult } = await apiProtect()
    const valid = await getCheckResult()

    const { setStatus, setResponse, getResponse } = Response()

    if (!valid) {
        setStatus(403)
        setResponse({ status: false, message: "Access denied." })
        return getResponse()
    }

    const userId = await getUserId()
    if (!userId) {
        setStatus(401)
        setResponse({ status: false, message: "User not found." })
        return getResponse()
    }

    const url = new URL(request.url)
    const method = url.searchParams.get("method")

    if (method !== "reorder") {
        setStatus(400)
        setResponse({ status: false, message: "Unsupported method." })
        return getResponse()
    }

    try {
        const body = await request.json()
        const { ids } = body || {}

        if (!Array.isArray(ids)) {
            setStatus(400)
            setResponse({ status: false, message: "ids must be an array." })
            return getResponse()
        }

        await connect()

        // Only allow reordering notes that belong to this user
        const owned = await Note.find({ userId, _id: { $in: ids } }).select("_id").lean()
        const ownedSet = new Set(owned.map((n) => String(n._id)))

        const ops = ids
            .filter((id) => ownedSet.has(String(id)))
            .map((id, index) => ({
                updateOne: {
                    filter: { _id: id, userId },
                    update: { $set: { order: index } },
                },
            }))

        if (ops.length > 0) {
            await Note.bulkWrite(ops)
        }

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Notes reordered.",
        })
    } catch (err) {
        console.error("Error reordering notes:", err)
        setStatus(500)
        setResponse({ status: false, message: "Note reordering error." })
    }

    return getResponse()
}
