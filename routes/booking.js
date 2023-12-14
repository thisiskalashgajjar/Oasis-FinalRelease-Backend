const express = require("express");
const router = express.Router();

const Booking = require("../models/bookings.model");




// insert data
router.post('/add', async (req, res) => {
    
    
    
    
    
    
    
    
    try {
        const { checkInDate, checkOutDate, noOfAdults, noOfChildren, noOfRooms, totalPrice, name, bookingReference} = req.body;
       


        const note = new Booking({
            checkInDate, checkOutDate, noOfAdults, noOfChildren, noOfRooms, totalPrice, name, bookingReference
        });
        const savednote = await note.save();
        res.json(savednote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});

// delete data
router.delete('/delete:id',  async (req, res) => {
    const { checkInDate, checkOutDate, noOfAdults, noOfChildren, noOfRooms, totalPrice, name, bookingReference} = req.body;
    try {

        //    find note by id
        let note = await Booking.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        }
        note = await Booking.findByIdAndDelete(req.params.id);
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});
// get all the notes
router.get("/fetch",  async (req, res) => {
    try {
        const notes = await Booking.find();
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occurred");
    }
});

module.exports = router;