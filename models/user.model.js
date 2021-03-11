const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    permissionLevel: Number,
    created_date: {type: Date, default: Date.now}
})

module.exports = User = mongoose.model("user", userSchema);
