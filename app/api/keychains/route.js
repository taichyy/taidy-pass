import mongoose from "mongoose"
import { NextResponse } from "next/server"

import connect from "@/lib/db"
import Account from "@/models/Account"
import Keychain from "@/models/Keychain"
import { encryptRecord, getUserId } from "@/lib/actions"

export const POST = async (request) => {
    // POST /api/keychains => create a new KeyChain
    // POST /api/keychains?method=get => get all keychains

    const userId = await getUserId()

    if (!userId) {
        const status = 401
        const response = {
            status: false,
            type: "user",
            message: "User not found.",
        }

        return NextResponse.json(
            response,
            { status }
        )
    }

    const url = new URL(request.url)
    const method = url.searchParams.get("method")

    const body = await request.json()

    let status = null;
    let response = {
        status: false,
        type: null,
        message: null,
        data: null,
    };

    if (method === "get") {
        // GET /api/keychains?method=get => get all keychains
        try {
            await connect()
    
            const keychains = await Keychain.find({
                userId
            });

            status = 200
            response.status = true
            response.type = "success"
            response.message = "Keychains fetched successfully"
            response.data = keychains
        } catch (error) {
            console.error("Error fetching keychain records:", error);

            status = 500
            response.status = false
            response.message = "keychain record fetching error."

            return NextResponse.json(
                response,
                { status }
            )
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
    
            status = 200
            response.status = true
            response.type = "success"
            response.message = "Keychain has been created"
        } catch (error) {
            console.error("Error creating keychain records:", error);

            status = 500
            response.status = false
            response.message = "Keychain record creating error."

            return NextResponse.json(
                response,
                { status }
            )
        } finally {
            session.endSession()
        }
    }

    return NextResponse.json(
        response,
        { status }
    )
}