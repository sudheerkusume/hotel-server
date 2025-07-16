const mongoose = require('mongoose')

const AddroomSchema =new mongoose.Schema({
    name:String,
    mobile:String,
    email:String
})

module.exports = mongoose.model("Enquiries",EnquirySchema)