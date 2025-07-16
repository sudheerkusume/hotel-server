const express = require("express");
const router = express.Router();
const routeAuth1 = require("../routeAuth1");
const Cart = require("../Model/CartModel");
const Order = require("../Model/OrderModel");

router.post("/confirmbooking", routeAuth1, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOrder = new Order({
      userId,
      rooms: cart.items,
      totalAmount,
      bookingDate: new Date(),
    });

    await newOrder.save();
    await Cart.deleteOne({ user: userId });

    res.status(201).json({ message: "Booking Confirmed!" });
  } catch (err) {
    console.error("Confirm Booking Error:", err);
    res.status(500).json({ error: "Booking failed." });
  }
});

module.exports = router;