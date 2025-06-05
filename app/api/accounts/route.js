import connect from "@/lib/db"
import Label from "@/models/Label"
import Account from "@/models/Account"
import { Response } from "@/lib/utils"
import { getUserId } from "@/lib/actions"

export const POST = async (request) => {
    // POST /api/accounts => create a new account
    // POST /api/accounts?method=get => get all accounts

    const userId = await getUserId()

    const { setStatus, setResponse, getResponse } = Response()

    if (!userId) {
        setStatus(401)
        setResponse({
            status: false,
            type: "user",
            message: "User not found.",
        })

        return getResponse();
    }

    const url = new URL(request.url)
    const method = url.searchParams.get("method")

    const body = await request.json()


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

            setStatus(200)
            setResponse({
                status: true,
                type: "success",
                message: "Account fetched successfully",
                data: accountsWithLabelNames,
            })
        } catch (error) {
            console.error("Error fetching account records:", error);

            setStatus(500)
            setResponse({
                status: false,
                message: "Account record fetching error.",
            })

            return getResponse();
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
    
            setStatus(200)
            setResponse({
                status: true,
                type: "success",
                message: "Account has been created",
            })
        } catch (error) {
            console.error("Error creating account records:", error);

            setStatus(500)
            setResponse({
                status: false,
                message: "Account record creating error.",
            })

            return getResponse();
        }
    }

    return getResponse();
}