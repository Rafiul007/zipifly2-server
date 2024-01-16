const express = require("express");
const router = express.Router();
const authDeliveryman = require("../Middleware/authDeliveryman");
const Order = require("../Model/order.model");

//  GET **/orders/** Display all orders to all deliveryman where order.deliveryman : null
router.get("/all-orders", authDeliveryman, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ deliveryman: null }],
    })
      .populate({
        path: "sender",
        select: "address district contactNumber", // Specify the fields you want to include from sender
      })
      .populate({
        path: "receiver",
        select: "address district contactNumber", // Specify the fields you want to include from receiver
      })
      .exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json("No orders");
  }
});
module.exports = router;
