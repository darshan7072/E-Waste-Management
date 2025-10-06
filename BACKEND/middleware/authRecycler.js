const jwt = require("jsonwebtoken");
const Recycler = require("../models/Recycler");

const authRecycler = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const recycler = await Recycler.findOne({ _id: decoded.id });

    if (!recycler) {
      return res.status(401).json({ message: "Not authorized as recycler" });
    }

    req.recycler = recycler;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = authRecycler;
