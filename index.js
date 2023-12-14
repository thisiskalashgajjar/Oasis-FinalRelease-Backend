const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
connectToMongo();

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "Welcome to User application." });
});
 app.use('/api/auth', require('./routes/auth'));
 app.use('/api/notes', require('./routes/booking'))

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
