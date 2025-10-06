const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// ✅ GET current user's profile
router.get("/profile", auth, async (req, res) => {
  try {
    const customer = await User.findById(req.customer._id).select("-password");
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ✅ PUT: Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.customer._id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

module.exports = router;
