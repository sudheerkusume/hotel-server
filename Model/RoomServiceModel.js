const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    text: String
});

module.exports = mongoose.model('RoomService', serviceSchema);