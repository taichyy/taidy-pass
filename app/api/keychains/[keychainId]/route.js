import bcrypt from "bcryptjs"
import mongoose from "mongoose"

import connect from "@/lib/db"
import User from "@/models/User"
import Account from "@/models/Account"
import { Response } from "@/lib/utils"
import Keychain from "@/models/Keychain"
import { getUserId } from "@/lib/actions"

export const DELETE = async (request, { params }) => {
    const { keychainId } = params

    const body = await request.json()
    const { password } = body || {}

    const { setStatus, setResponse, getResponse } = Response()

    if (!keychainId) {
        setStatus(400)
        setResponse({
            status: false,
            type: "keychain",
            message: "Keychain ID is required.",
        })
        return getResponse();
    }

    const session = await mongoose.startSession();

    // Fetch
    try {
        await connect()

        // Check user 
        const loginedUserId = await getUserId()
        const user = await User.findOne({ _id: loginedUserId });

        if (!user) {
            setStatus(401)
            setResponse({
                status: false,
                type: "user",
                message: "User does not exist.",
            })
            return getResponse();
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            setStatus(401)
            setResponse({
                status: false,
                type: "password",
                message: "Password is incorrect.",
            })
            return getResponse();
        }

        // Everything is fine, start to delete the keychain
        session.startTransaction();

        // Delete all the account records associated with the keychain
        await Account.deleteMany({ keychainId }, { session });
        const keychain = await Keychain.findByIdAndDelete(keychainId, { session });

        if (!keychain) {
            setStatus(404)
            setResponse({
                status: false,
                type: "keychain",
                message: "Keychain not found.",
            })
            await session.abortTransaction();
            return getResponse();
        }

        await session.commitTransaction();

        setStatus(200)
        setResponse({
            status: true,
            type: "success",
            message: "Keychain has been deleted.",
        })
    } catch (err) {
        console.error("Error deleting Keychain record:", err);

        await session.abortTransaction();

        setStatus(500)
        setResponse({
            status: false,
            type: "error",
            message: "Keychain deletion failed.",
        })
    } finally {
        session.endSession();
    }

    return getResponse();
}