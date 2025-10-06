// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const User = require("../models/User");

// router.get("/", auth, async (req, res) => {
//   try {
//     const customer = await User.findById(req.customer._id).select("-password");
//     if (!customer) return res.status(404).json({ message: "User not found" });
//     res.json(customer);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.put("/", auth, async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.customer._id,
//       req.body,
//       { new: true }
//     ).select("-password");
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/profile
// @desc    Get logged-in customer profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const customer = await User.findById(req.customer._id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(customer);
  } catch (err) {
    console.error("GET /api/profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/profile
// @desc    Update logged-in customer profile
// @access  Private
router.put("/", auth, async (req, res) => {
  try {
    console.log("Update request body:", req.body);

    const { fullName, phoneNumber, address, profession, bio } = req.body;

    const updatedFields = {
      fullName,
      phoneNumber,
      address,
      profession,
      bio
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.customer._id,
      { $set: updatedFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
