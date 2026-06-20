import mongoose from "mongoose";

const { Schema } = mongoose

const accountSchema = new Schema({
    starred: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    remark: {
        type: String,
        required: false,
    },

    label: {
        type: [String],
    },
    userId: {
        type: String,
        required: true,
    },
    // Null, or UUID, null for default password key chain, UUID for custom password key chain.
    keychainId: {
        type: String,
        default: null,
    },
    // Optional reference to another account (same keychain or default keychain).
    // Plain ObjectId string, not encrypted — doesn't leak credentials on its own.
    linkedAccountId: {
        type: String,
        default: null,
    },
    // "validation" or null
    type: {
        type: String,
    }
})

// Indexes
// Primary list query: filter by owner + keychain, sorted by starred
accountSchema.index({ userId: 1, keychainId: 1, starred: -1 });
// Label filtering within a keychain
accountSchema.index({ userId: 1, keychainId: 1, label: 1 });
// External link lookups (find records that reference a given source account)
accountSchema.index({ linkedAccountId: 1 });

const Account = mongoose?.models?.Account || mongoose.model("Account", accountSchema);

export default Account;