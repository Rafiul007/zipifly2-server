const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Parcel = require("../Model/parcel.model");
const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const authGuard = require("../Middleware/authGuard");

//route to create a parcel in DB -.-.-.-.-.-.-.-.-.-.-.-.-.-.-..-.-.-.-.-.-.-.-.-.-.-.
router.post("/", authGuard, async (req, res) => {
  //validate the request body fields
  try {
    if (!req.body.sender || !req.body.receiver || !req.body.weight)
      throw new Error("All fields are required");
    console.log(req.body.sender);
    console.log(req.body.receiver);
    console.log(req.body.weight);
    let userId = req.userId;
    let username = req.username;
    console.log("Testing: User id ", req.userId);
    console.log("Testing username", req.username);
    let senderUser = await User.findOne({ username });
    console.log("Testing: checking senderUser: ", senderUser);
    if (!senderUser) throw new Error("Invalid credentials");
    let sendUserId = senderUser._id;

    // checking if receiver is in the "users"
    let recUser = await User.findOne({ username: req.body.receiver }); //receive er username jeta pabo oita diye search kortisi
    if (!recUser) throw new Error("Receiver does not exist!");
    let recUserId = recUser._id;
    // parcelsSchema has sender and receiver ids.
    //need to save and populate sender and receiver in parcel
    // Create a new parcel
    const newParcel = await Parcel.create({
      sender: sendUserId,
      receiver: recUserId,
      weight: parseInt(req.body.weight),
      category: req.body.category,
      cashCollection: parseInt(req.body.cashCollection),
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

// GET method: get a specific

module.exports = router;
