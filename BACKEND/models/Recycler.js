const mongoose = require("mongoose");

const recyclerSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  organization: { type: String },
  serviceArea: { type: String },
  address: { type: String },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  bio: { type: String }
});

module.exports = mongoose.model("Recycler", recyclerSchema);
