const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    parcel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parcel",
      required: true,
    },
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
    deliveryman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deliveryman",
      required: true,
      default: "none",
    },
    pickupDate: {
      type: Date,
      required: false,
    },
    dropDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Picked up", "In transit", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
module.exports = Order = mongoose.model("Order", orderSchema);
