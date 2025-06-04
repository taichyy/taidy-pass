import { NextResponse } from "next/server"

import connect from "@/lib/db"
import Label from "@/models/Label"
import Account from "@/models/Account"
import { getUserId } from "@/lib/actions"

export const POST = async (request) => {
    // POST /api/accounts => create a new account
    // POST /api/accounts?method=get => get all accounts

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
        // GET /api/accounts?method=get => get all accounts
        try {
            // Labels for filtering.
            const { labels, keychainId } = body || {}

            await connect()
    
            const query = { userId };

            if (labels.length > 0) {
                query.label = { $in: labels };
            }
            if (keychainId) {
                query.keychainId = keychainId;
            } else {
                // Null, isn't null, but default key chain
                query.keychainId = null; 
            }

            const accounts = await Account.find(query).sort({ starred: -1, });

            // Collect all used label key
            const allLabelKeys = Array.from(new Set(accounts.flatMap(acc => acc.label)));

            // Kind of join operation here
            const labelDocs = await Label.find({ key: { $in: allLabelKeys } });
            const labelMap = new Map(labelDocs.map(label => [label.key, label.name]));
            const accountsWithLabelNames = accounts.map(acc => ({
                ...acc.toObject(),
                label: acc.label.map(key => labelMap.get(key) || key) // fallback to key if name not found
            }));

            status = 200
            response.status = true
            response.type = "success"
            response.message = "Account fetched successfully"
            response.data = accountsWithLabelNames
        } catch (error) {
            console.error("Error fetching account records:", error);

            status = 500
            response.status = false
            response.message = "Account record fetching error."

            return NextResponse.json(
                response,
                { status }
            )
        }
    } else if ( !method ) {
        // POST /api/accounts => create a new account
        // This is encrypted data, by user at client.
        const { title, username, password, remark, label, keychainId } = body || {}

        const data = {
            title,
            username,
            password,
            remark,
            userId,
            label,
            keychainId,
        }

        const newAccount = new Account(data)
    
        // Fetch
        try {
            // From utils/db.js
            await connect()
            await newAccount.save()
    
            status = 200
            response.status = true
            response.type = "success"
            response.message = "Account has been created"
        } catch (error) {
            console.error("Error creating account records:", error);

            status = 500
            response.status = false
            response.message = "Account record creating error."

            return NextResponse.json(
                response,
                { status }
            )
        }
    }

    return NextResponse.json(
        response,
        { status }
    )
}