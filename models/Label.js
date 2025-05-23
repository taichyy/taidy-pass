import mongoose from "mongoose";

const { Schema } = mongoose;

// Labels, including custom and system labels.
// System labels are created by the system and cannot be deleted.
// Custom labels are created by the user and can be deleted.

// System requires: key, and name, distinguished by key.
// Custom requires: name and userId, distinguished by userId and _id.
const labelSchema = new Schema({
    key: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    // Custom label with userId
    userId: {
        type: String,
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
labelSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});
module.exports = mongoose.models.Label || mongoose.model('Label', labelSchema);
