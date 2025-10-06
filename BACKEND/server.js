require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require("./routes/profileRoutes");
const recyclerProfileRoutes = require("./routes/recyclerProfileRoutes");

//const orderRoutes = require('./routes/orders');



const app = express();
const PORT = process.env.PORT || 5500;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", orderRoutes);
app.use("/api/recycler/profile", recyclerProfileRoutes);
// app.use("/api/user", userRoutes);
//app.use("/api/orders", orderRoutes);

app.use("/api/orders", require("./routes/orderRoutes"));

//app.use("/api", orderRoutes);



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  userType: String, // 'user' or 'retailer'
});

// User Model
// const User = mongoose.model("users", UserSchema);


const User = require("./models/User");
const Order = require("./models/Order");


// ✅ REGISTER API
// app.post("/register", async (req, res) => {
//   try {
//     const { fullName, email, password, userType } = req.body;

//     // Check if user already exists
//     let userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: "User already exists" });

//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save new user
//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//       userType,
//     });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });


app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    console.log("📩 Incoming registration request:", req.body); // Debug log

    // Check if user already exists
    let customerExists = await User.findOne({ email });
    if (customerExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save(); // Might be throwing the error

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("❌ Registration error:", error); // Logs exact issue
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ LOGIN API
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });

//     console.log("Login request received:", req.body);

//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, userType: user.userType },
//       SECRET_KEY,
//       { expiresIn: "1h" }
//     );

//     res
//       .status(200)
//       .json({ message: "Login successful", token, userType: user.userType });
//   } catch (error) {
//     console.error("Login error:", error); // Log the actual error
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });


app.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body); // ✅ Debugging

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const customer = await User.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: customer._id, userType: customer.userType },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("User logged in:", { email, userType: customer.userType }); // ✅ Debugging
    // res.status(200).json({ message: "Login successful", token, userType: user.userType });

    // res.status(200).json({
    //   message: "Login successful",
    //   token,
    //   userType: user.userType,
    //   userId: user._id, // ✅ Add this line!
    // });

    res.status(200).json({
      message: "Login successful",
      token,
      userType: customer.userType,
      userId: customer._id,
      user: {
        fullName: customer.fullName,
        email: customer.email,
        userType: customer.userType,
        _id: customer._id
      }
    });
    


  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// ✅ PLACE ORDER API
// app.post("/place-order", async (req, res) => {
//   try {
//     const { userId, ewasteType, description, collectionDate, timeSlot, address } = req.body;

//     if (!userId || !ewasteType || !description || !collectionDate || !timeSlot || !address) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newOrder = new Order({
//       userId,
//       ewasteType,
//       description,
//       collectionDate,
//       timeSlot,
//       address,
//     });

//     await newOrder.save();
//     res.status(201).json({ message: "Order placed successfully" });
//   } catch (error) {
//     console.error("Order placement error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

app.post("/place-order", async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "User ID and items are required." });
    }

    const {
      ewasteType,
      description,
      collectionDate,
      timeSlot,
      address: collectionAddress,
    } = items[0]; // ⬅️ extract from first item

    const newOrder = new Order({
      userId,
      ewasteType,
      description,
      collectionAddress,
      collectionDate,
      timeSlot,
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully." });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ GET USER ORDERS
app.get("/user-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ userId });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
