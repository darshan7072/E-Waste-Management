const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const Order = require("../models/Order");

// Only get orders for the logged-in user
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.customer.userId;
    const orders = await Order.find({ userId: userId });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
