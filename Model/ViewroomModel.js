const mongoose = require('mongoose')

const ViewroomSchema =new mongoose.Schema({
    type: String,
    room: String,
    occupancy: String,
    price_per_day: String,
    image: String
})

module.exports = mongoose.model("Viewroom",ViewroomSchema)