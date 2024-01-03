const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  parcels_sent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
    },
  ],
  parcels_received: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
    },
  ],
});
module.exports = User = mongoose.model("User", userSchema);
