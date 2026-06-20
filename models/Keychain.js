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

// Indexes
keychainSchema.index({ userId: 1 });

const Keychain = mongoose?.models?.Keychain || mongoose.model("Keychain", keychainSchema);

export default Keychain;