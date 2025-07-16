const express = require('express');
const router = express.Router();
const Cart = require('../Model/CartModel');
const routeAuth1 = require('../routeAuth1');

// Add room to user's cart (array of items)
router.post('/addtocart', routeAuth1, async (req, res) => {
  try {
    const {
      roomId, roomTitle, roomPrice, image,
      checkIn, checkOut, totalNights, totalPrice,
      guestName, guestEmail, guestPhone
    } = req.body;

    const userId = req.user.id;

    // Structure for one room item
    const newItem = {
      roomId,
      roomTitle,
      roomPrice,
      image,
      checkIn,
      checkOut,
      totalNights,
      totalPrice,
      guestName,
      guestEmail,
      guestPhone
    };

    // Check if user already has a cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: userId,
        items: [newItem]
      });
    } else {
      // Append new item to existing cart
      cart.items.push(newItem);
    }

    await cart.save();
    res.status(201).json({ message: "Room added to cart successfully." });
  } catch (err) {
    console.error("Error in /addtocart:", err);
    res.status(500).send("Server Error");
  }
});

// Get all cart items for the logged-in user
router.get('/mycart', routeAuth1, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.json([]); // return empty array if no cart/items
    }

    res.json(cart.items); // return only the items array
  } catch (err) {
    console.error("Error in /mycart:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;