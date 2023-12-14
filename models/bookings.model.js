const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Booking = new Schema({
    checkInDate:{
        type: Date
    },
    checkOutDate:{
        type: Date
    },
    noOfAdults:{
        type: Number
    },
    noOfChildren:{
        type: Number,
    },
    noOfRooms:{
        type:Number
    },
    totalPrice:{
        type:Number
    },
    name:{
        type:String
    },
    bookingReference:{
        type: String
    }
});

module.exports = mongoose.model('Booking', Booking);