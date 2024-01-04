const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://thisiskalashgajjar:JaySwaminarayan@thisiskalashgajjar.orzvxh6.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("connected to mongo successfully");
    });
}

module.exports = connectToMongo;
