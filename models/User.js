import crypto from "crypto";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    // AES 加密，可解碼
    usernameEncrypted: { 
        type: String, 
        required: true 
    }, 
    // SHA256 hash 判斷唯一性
    usernameHash: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    email: {
        type: String,
        required: false,
    },
    emailVerified: {
        type: Date,
    },
    // Hashed password
    password: {
        type: String, 
        required: true,
    },
    salt: {
        type: String,
        required: true,
        default: () => crypto.randomBytes(16).toString("base64url"),
    },
    provider: {
        type: String,
        required: true,
        enum: ["credentials", "google", "github"],
        default: "credentials",
    },
    // Third-party provider id, optional if provider as credentials.
    providerId: {
        type: String, 
    },
    avatarUrl: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
});

// 自動更新 updatedAt
userSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
