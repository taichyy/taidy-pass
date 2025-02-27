import mongoose from "mongoose";

const { Schema } = mongoose

const accountSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: false,
        enum: ["key"],
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
})

module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);
