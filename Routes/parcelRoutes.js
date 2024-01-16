const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Parcel = require("../Model/parcel.model");
const Order = require("../Model/order.model")
const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const authGuard = require("../Middleware/authGuard");

//route to create a parcel in DB -.-.-.-.-.-.-.-.-.-.-.-.-.-.-..-.-.-.-.-.-.-.-.-.-.-.
router.post("/", authGuard, async (req, res) => {
  //validate the request body fields
  try {
    if (!req.body.sender || !req.body.receiver || !req.body.weight)
      throw new Error("All fields are required");
    let userId = req.userId;
    let username = req.username;
    let senderUser = await User.findOne({ username });
    if (!senderUser) throw new Error("Invalid credentials");
    let sendUserId = senderUser._id;

    // checking if receiver is in the "users"
    let recUser = await User.findOne({ username: req.body.receiver }); //receive er username jeta pabo oita diye search kortisi
    if (!recUser) throw new Error("Receiver does not exist!");
    let recUserId = recUser._id;

    const newParcel = await Parcel.create({
      sender: sendUserId,
      receiver: recUserId,
      weight: parseInt(req.body.weight),
      category: req.body.category,
      cashCollection: parseInt(req.body.cashCollection),
      totalCash: parseInt(req.body.totalCash),
    });
    // create order
    const newOrder = await Order.create({
      parcel: newParcel._id,
      sender: sendUserId,
      receiver: recUserId,
      totalCash: parseInt(req.body.totalCash),
    });
    // Update sender's and receiver's parcels arrays
    await User.findByIdAndUpdate(sendUserId, {
      $push: { parcels_sent: newParcel._id },
    });

    await User.findByIdAndUpdate(recUserId, {
      $push: { parcels_received: newParcel._id },
    });
    return res.status(201).send("Parcel added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// get method: Get parcel details
router.get("/:id", authGuard, async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate({
        path: "sender",
        select: "username email contactNumber fullname", // Specify the fields you want to include
      })
      .populate({
        path: "receiver",
        select: "username email contactNumber fullname", // Specify the fields you want to include
      })
      .exec();
    if (!parcel) throw new Error("No parcel with that id found");
    return res.status(200).json(parcel);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: err.message });
  }
});
//delete a parcel by id where username is sender username
router.delete("/delete/:parcelId", authGuard, async (req, res) => {
  try {
    let user = await User.findById(req.userId, "username").exec();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const deletedParcel = await Parcel.findOneAndDelete({
      _id: req.params.parcelId,
      sender: req.userId,
    }).exec();
    const deletedOrder = await Order.findOneAndDelete({
      parcel: req.params.parcelId,
    }).exec();
    if (!deletedParcel)
      throw new Error(
        "No such parcel exists or You are not authorised to delete this parcel."
      );
    else {
      return res.status(200).json({ message: "Successfully Deleted" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
