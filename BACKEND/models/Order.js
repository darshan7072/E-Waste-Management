const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  items: [
    {
      name: String,
      quantity: Number,
      category: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  ewasteType: {
    type: String,
    required: true,
  },
  collectionAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Order", OrderSchema);
