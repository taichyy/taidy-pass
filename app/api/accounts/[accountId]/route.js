import connect from "@/lib/db"
import Account from "@/models/Account"
import { Response } from "@/lib/utils"
import { getUserId } from "@/lib/actions"

export const GET = async (request, { params }) => {
    const loginedUserId = await getUserId()

    const { accountId } = params

    const { setStatus, setResponse, getResponse } = Response()

    // Fetch
    try {
        await connect()

        const account = await Account.findById(accountId)

        const { title, username, password, label, remark, userId } = account

        if (userId != loginedUserId) {
            setStatus(403)
            setResponse({
                status: false,
                type: "error",
                message: "You are not authorized to access this account.",
            })
        } else {
            const data = {
                _id: account._id,
                title,
                username,
                password,
                remark,
                label,
            }
    
            setStatus(200)
            setResponse({
                status: true,
                type: "success",
                message: "Account fetched successfully.",
                data,
            })
        }
    } catch (err) {
        console.error("Error fetching account record by id:", err);

        setStatus(500)
        setResponse({
            status: false,
            type: "error",
            message: "Account fetch failed.",
        })
    }

    return getResponse()
}

export const PUT = async (request, { params }) => {
    const loginedUserId = await getUserId()
    const { accountId } = params

    // Get mode from search params
    const url = new URL(request.url)
    const mode = url.searchParams.get("mode")

    const { setStatus, setResponse, getResponse } = Response()

    // Fetch
    try {
        let data = {}
        
        const body = await request.json()

        const { title, username, password, label, remark, userId } = body || {}

        // From utils/db.js
        await connect()

        const findAccount = await Account.findById(accountId)

         // If it's a regular PUT req.
        if (mode == "account") {            
            data = {
                title,
                username,
                password,
                label,
                remark,
            }
        } else if (mode == "starred") {
            const currentStarred = findAccount.starred
            data = {
                starred: !(!!currentStarred),
            }
        }

        if (findAccount.type == "validation") {
            setStatus(400)
            setResponse({
                status: false,
                type: "error",
                message: "You cannot update a validation account.",
            })

            return getResponse()
        }

        if (userId != loginedUserId) {
            setStatus(403)
            setResponse({
                status: false,
                type: "error",
                message: "You are not authorized to access this account.",
            })
        } else {
            await Account.findByIdAndUpdate(accountId, data)
    
            setStatus(200)
            setResponse({
                status: true,
                type: "success",
                message: "Account has been updated.",
            })
        }
    } catch (err) {
        console.error("Error updating account record:", err);

        setStatus(500)
        setResponse({
            status: false,
            type: "error",
            message: "Account update failed.",
        })
    }

    return getResponse()
}

export const DELETE = async (request, { params }) => {
    const { accountId } = params

    const { setStatus, setResponse, getResponse } = Response()

    // Fetch
    try {
        await connect()
        await Account.findByIdAndDelete(accountId)

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Account has been deleted.",
        })
    } catch (err) {
        console.error("Error deleting account record:", err);

        setStatus(500)
        setResponse({
            status: false,
            type: "error",
            message: "Account deletion failed.",
        })
    }

    return getResponse()
}