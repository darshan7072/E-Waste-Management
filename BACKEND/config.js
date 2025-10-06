// require("dotenv").config();

// mongoose.connect(MONGO_URI);
const mongoose = require("mongoose"); // ✅ Make sure this is at the top
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
};


