import mongoose from "mongoose";

const { Schema } = mongoose;

// Sticky notes. Encrypted server-side with NOTE_SECRET.
const noteSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        // Encrypted (CryptoJS.AES with NOTE_SECRET)
        title: {
            type: String,
            default: "",
        },
        // Encrypted (CryptoJS.AES with NOTE_SECRET)
        context: {
            type: String,
            default: "",
        },
        // For drag-and-drop ordering. Lower shows first.
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Note = mongoose?.models?.Note || mongoose.model("Note", noteSchema);

export default Note;
