const User = require("../models/User");

// @desc    Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Update current user profile
exports.updateProfile = async (req, res) => {
  const { fullName, phoneNumber, address, profession, bio } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        phoneNumber,
        address,
        profession,
        bio,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
