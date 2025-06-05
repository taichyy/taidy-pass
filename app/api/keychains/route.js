import mongoose from "mongoose"

import connect from "@/lib/db"
import Account from "@/models/Account"
import { Response } from "@/lib/utils"
import Keychain from "@/models/Keychain"
import { encryptRecord, getUserId } from "@/lib/actions"

export const POST = async (request) => {
    // POST /api/keychains => create a new KeyChain
    // POST /api/keychains?method=get => get all keychains

    const userId = await getUserId()

    const { setStatus, setResponse, getResponse } = Response()

    if (!userId) {
        setStatus(401)
        setResponse({
            status: false,
            type: "user",
            message: "User not found.",
        })

        return getResponse()
    }

    const url = new URL(request.url)
    const method = url.searchParams.get("method")

    const body = await request.json()

    if (method === "get") {
        // GET /api/keychains?method=get => get all keychains
        try {
            await connect()
    
            const keychains = await Keychain.find({
                userId
            });

            setStatus(200)
            setResponse({
                status: true,
                type: "success",
                message: "Keychains fetched successfully",
                data: keychains,
            })
        } catch (error) {
            console.error("Error fetching keychain records:", error);

            setStatus(500)
            setResponse({
                status: false,
                message: "Keychain record fetching error.",
            })

            return getResponse();
        }
    } else if ( !method ) {
        const session = await mongoose.startSession()
        
        // POST /api/keychains => create a new keychain
        // This is encrypted data, by user at client.
        const { name, derivedKey } = body || {}

        // Generate new keychain
        const data = {
            name,
            userId,
        }

        const newKeyChain = new Keychain(data)

        // Generate a verifying data inside keychain by default, encrypted by derivedKey
        
        const obj = {
            type: "validation",
            title: "validation",
            username: "validation",
            password: "validation",
            userId,
            keychainId: newKeyChain._id.toString(),
        }
    
        const encryptedObj = await encryptRecord(obj, derivedKey)

        const newAccount = new Account(encryptedObj)
    
        // Fetch
        try {
            session.startTransaction()

            // From utils/db.js
            await connect()
            await newKeyChain.save({ session })
            await newAccount.save({ session })

            await session.commitTransaction()
    
            setStatus(200)
            const response = {
                status: true,
                type: "success",
                message: "Keychain has been created",
            }
        } catch (error) {
            console.error("Error creating keychain records:", error);

            setStatus(500)
            setResponse({
                status: false,
                message: "Keychain record creating error.",
            })

            return getResponse()
        } finally {
            session.endSession()
        }
    }

    return getResponse()
}