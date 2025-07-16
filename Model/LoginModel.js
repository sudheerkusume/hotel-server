const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
    user : String,
    email : String,
    password: String
});

module.exports = mongoose.model("Login", LoginSchema)