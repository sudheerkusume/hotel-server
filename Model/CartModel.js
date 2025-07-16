const mongoose = require("mongoose");

const RoomItemSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Viewroom",
  },
  roomTitle: String,
  roomPrice: Number,
  image: String,
  checkIn: Date,
  checkOut: Date,
  totalNights: Number,
  totalPrice: Number,
  guestName: String,
  guestEmail: String,
  guestPhone: String,
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
    unique: true, // one cart per user
  },
  items: [RoomItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", CartSchema);