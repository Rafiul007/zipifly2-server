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
        path: "parcel",
        select: "weight category", // Specify the fields you want to include from sender
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

// Get all order of a deliveryman that he accepted.
router.get("/accepted-delivery", authDeliveryman, async (req, res) => {
  const uid = req.userId;
  try {
    let orders = await Order.find({ deliveryman: uid })
      .sort("-createdAt")
      .populate({
        path: "sender",
        select: "username  contactNumber address district",
      })
      .populate({
        path: "receiver",
        select: "username  contactNumber address district",
      })
      .populate({
        path: "parcel",
        select: "totalCash weight category",
      })
      .exec();
    if (!orders) {
      return res.status(404).send();
    } else return res.status(200).json(orders);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
});
module.exports = router;
