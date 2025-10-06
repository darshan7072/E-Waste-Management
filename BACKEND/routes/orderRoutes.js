const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // ✅ Ensure this matches filename
const auth = require("../middleware/auth"); // Optional: If using authentication

// ✅ GET all orders (for admin/recycler)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "fullName email");
    res.status(200).json(orders);          
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// ✅ GET orders for a specific user (customer)
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.params.userId });
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user orders", error: err.message });
//   }
// });

router.get("/myorders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your orders", error: err.message });
  }
});



// ✅ New: Place Order
router.post("/", auth, async (req, res) => {
  try {
    console.log("🔔 Order received:", req.body);
    console.log("👤 Authenticated User ID:", req.user._id);

    const { userId, items , ewasteType, description, collectionAddress } = req.body;

    const newOrder = new Order({
      userId: req.user._id,
      ewasteType,
      description,
      collectionAddress,
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("❌ Order placement error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// ✅ PUT: Recycler updates the status of an order
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to fetch order statistics for Recycler (counts of pending, accepted, rejected)
router.get("/recycler/orders-status", auth, async (req, res) => {
  try {
    const recyclerId = req.user._id; // Assuming user is logged in

    // Aggregate order counts based on status (pending, accepted, rejected)
    const orderStats = await Order.aggregate([
      { $match: { recyclerId } },
      {
        $group: {
          _id: "$status", // Group orders by status
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      pending: 0,
      accepted: 0,
      rejected: 0,
      totalCollected: 0, // If we are also tracking the weight of e-waste collected
      totalCustomers: 0, // Optionally track the number of unique customers
    };

    // Populate stats object with counts
    orderStats.forEach(status => {
      if (status._id === 'pending') stats.pending = status.count;
      if (status._id === 'accepted') stats.accepted = status.count;
      if (status._id === 'rejected') stats.rejected = status.count;
    });

    // Optionally populate additional stats like total weight and unique customers
    stats.totalCollected = await Order.aggregate([
      { $match: { recyclerId } },
      { $group: { _id: null, totalWeight: { $sum: "$weight" } } },
    ]);

    stats.totalCustomers = await Order.distinct("userId").countDocuments();

    res.json(stats); // Send aggregated stats to the frontend
  } catch (err) {
    res.status(500).json({ message: "Error fetching order stats", error: err.message });
  }
});

module.exports = router;










// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const verifyToken = require("../middleware/auth"); // Your existing auth middleware

// // 🔒 Personalized Orders Route
// router.get("/myorders", verifyToken, async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user.id }).populate("userId", "fullName email");
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching your orders", error: err.message });
//   }
// });


// // Existing Route: GET all orders (Admin / Recycler)
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find().populate("userId", "fullName email");
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching orders", error: err.message });
//   }
// });

// // Optional: GET by userId (if not using /myorders)
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.params.userId });
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user orders", error: err.message });
//   }
// });

// module.exports = router;
