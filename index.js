const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
require("dotenv").config();

//express
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));


//port
const PORT = process.env.PORT || 6969

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

//mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err) =>{
    if(err) throw err
    console.log("MongoDB connection stablished!");
})

//route
app.use("/user", require("./routes/user"));

app.use("/users", require("./routes/users/user_login"));

