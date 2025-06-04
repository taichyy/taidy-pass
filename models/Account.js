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
    // "validation" or null
    type: {
        type: String,
    }
})

module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);
