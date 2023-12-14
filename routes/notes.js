const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// insert data
router.post('/add', [body("heading", "enter valid heading").isLength({ min: 2 })], async (req, res) => {

    try {
        const { heading, content, author, date } = req.body;
        // for error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const note = new Note({
            heading, content, author, date,
        });
        const savednote = await note.save();
        res.json(savednote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});
// update data
router.put('/update/:id', fetchUser, async (req, res) => {
    const { heading, content, author, date } = req.body;
    try {
        const newNote = {};
        if (heading) {
            newNote.heading = heading;
        }

        if (content) {
            newNote.content = content;
        }

        if (author) {
            newNote.author = author;
        }
        if (date) {
            newNote.date = date;
        }
        //    find note by id
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});
// delete data
router.delete('/delete/:id', fetchUser, async (req, res) => {
    const { heading, content, author, date } = req.body;
    try {

        //    find note by id
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});
// get all the notes
router.get("/fetch", fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occurred");
    }
});
router.get("/per/:id", fetchUser, async (req, res) => {
    try {
        const notes = await Note.findById(req.params.id);
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occurred");
    }
});

module.exports = router;