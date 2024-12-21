import mongoose from "mongoose";

const { Schema } = mongoose

const keyAccountSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
})

module.exports = mongoose.models.KeyAccount || mongoose.model('KeyAccount', keyAccountSchema);