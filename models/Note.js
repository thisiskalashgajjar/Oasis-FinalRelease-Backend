const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    heading: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    author: {
        type: String,
        required: true,
    },
    date: {
        type: Date,

    }
});

const Notes = mongoose.model("notes", NotesSchema);
module.exports = Notes;