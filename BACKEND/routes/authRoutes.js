const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const config = require("../config");

// User Registration
router.post("/register", async (req, res) => {
  const { fullName, email, password, userType } = req.body;

  try {
    let customer= await User.findOne({ email });
    if (customer) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    customer = new User({ fullName, email, password: hashedPassword, userType });

    await customer.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await User.findOne({ email });
    if (!customer) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: customer._id, userType: customer.userType }, config.jwtSecret, { expiresIn: "1h" });
    res.json({ token, userType: customer.userType });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const router = express.Router();
// const config = require("../config");

// // User Registration
// router.post("/register", async (req, res) => {
//   const { fullName, email, password, role } = req.body; // Updated userType to role

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user = new User({ fullName, email, password: hashedPassword, role }); // Updated userType to role

//     await user.save();
//     res.json({ message: "User registered successfully!" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // User Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "1h" }); // Updated userType to role
//     res.json({ token, role: user.role }); // Updated userType to role
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
