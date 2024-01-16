const mongoose = require("mongoose");
const deliveryManSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verification_number: {
      type: Number,
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = Deliveryman = mongoose.model("Deliveryman", deliveryManSchema);
