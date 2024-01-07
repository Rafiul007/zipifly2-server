const mongoose = require("mongoose");
const parcelSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Transit", "Delivered"],
    default: "Pending",
  },
  cashCollection: {
    type: Number,
    required: true,
  },
  totalCash: {
    type: Number,
    required: true,
  },
},{ timestamps: true });
module.exports = Parcel = mongoose.model("Parcel", parcelSchema);
