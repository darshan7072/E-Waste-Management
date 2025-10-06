// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied: No Token Provided!" });
//   }

//   try {
//     const verified = jwt.verify(token.split(" ")[1], "your_jwt_secret"); // Use same secret as in login
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: "Invalid Token" });
//   } coustomer
// };

// module.exports = verifyToken;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⛔ No token found in header");
    return res.status(400).json({ message: "No token provided" }); // This causes your 400
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    const customer = await User.findById(decoded.userId).select("-password");
    if (!customer) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "User not found" });
    }

    req.customer = customer;
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = auth;
