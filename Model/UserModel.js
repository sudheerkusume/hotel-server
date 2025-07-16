const mongoose = require("mongoose")

const CustomerSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cpassword: String,
    mobile: String,
    address: String
})

module.exports = mongoose.model("Customer", CustomerSchema)