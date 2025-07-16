const mongoose = require("mongoose")

const FuserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  items: String  // <-- Assuming cart items stored here
});

module.exports = mongoose.model("Fuser", FuserSchema)