import mongoose from "mongoose";

const { Schema } = mongoose

const keychainSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.models.Keychain || mongoose.model('Keychain', keychainSchema);
