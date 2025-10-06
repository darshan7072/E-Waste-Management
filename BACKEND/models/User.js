// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   userType: { type: String, required: true, enum: ["customer", "recycler"] },
// });
// //const mongoose = require("mongoose");



// const userSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   phoneNumber: {
//     type: String,
//   },
//   address: {
//     type: String,
//   },
//   profession: {
//     type: String,
//   },
//   bio: {
//     type: String,
//   },
//   profilePicture: {
//     type: String, // URL or base64 (optional, future feature)
//   },
//   joinedDate: {
//     type: Date,
//     default: Date.now,
//   },
//   role: {
//     type: String,
//     enum: ["customer", "recycler", "admin"],
//     default: "customer",
//   }
// });
// //const mongoose = require("mongoose");
// //export default mongoose.model('User', userSchema);

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ["customer", "recycler"] },
  phoneNumber: { type: String },
  address: { type: String },
  profession: { type: String },
  bio: { type: String },
  profilePicture: { type: String }, // for future enhancement
  joinedDate: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["customer", "recycler", "admin"],
    default: "customer",
  },


 // NEW FIELDS for recyclers
 organization: String,
 serviceArea: String,
 totalPickups: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", UserSchema);
