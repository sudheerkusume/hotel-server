const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fuser", // or "Customer" or "UserModel" based on your actual user model
      required: true,
    },
    rooms: [
      {
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Viewroom",
        },
        roomTitle: {
          type: String,
          required: true,
        },
        roomPrice: {
          type: Number,
          required: true,
        },
        image: String,
        checkIn: {
          type: Date,
          required: true,
        },
        checkOut: {
          type: Date,
          required: true,
        },
        totalNights: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        guestName: {
          type: String,
          required: true,
        },
        guestEmail: {
          type: String,
          required: true,
        },
        guestPhone: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Order", OrderSchema);