const express = require("express");
const router = express.Router();
const Recycler = require("../models/Recycler");
const authRecycler = require("../middleware/authRecycler");

// GET recycler profile
router.get("/", authRecycler, async (req, res) => {
  try {
    const recycler = await Recycler.findById(req.recycler._id).select("-password");
    if (!recycler) {
      return res.status(404).json({ message: "Recycler not found" });
    }
    res.json(recycler);
  } catch (err) {
    console.error("GET Recycler Profile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE recycler profile
router.put("/", authRecycler, async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      address,
      organization,
      serviceArea,
      bio
    } = req.body;

    const updatedRecycler = await Recycler.findByIdAndUpdate(
      req.recycler._id,
      {
        $set: {
          fullName,
          phoneNumber,
          address,
          organization,
          serviceArea,
          bio
        }
      },
      { new: true }
    ).select("-password");

    if (!updatedRecycler) {
      return res.status(404).json({ message: "Recycler not found" });
    }

    res.json(updatedRecycler);
  } catch (err) {
    console.error("PUT Recycler Profile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
