const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "deliveryman";
const router = express.Router();
const Deliveryman = require("../Model/deliverMan.model");
const Order = require("../Model/order.model");
const Parcel = require("../Model/parcel.model");
const authDeliveryman = require("../Middleware/authDeliveryman");
const { ObjectId } = require("mongoose").Types;
// Function to generate a username for deliveryman with 3 random numbers
function generateUsername(name) {
  // Remove spaces from the name
  const nameWithoutSpaces = name.replace(/\s/g, "");
  // Generate 3 random numbers between 100 and 999
  const randomNumbers = Math.floor(100 + Math.random() * 900);
  // Concatenate the formatted name and random numbers to form the username
  const username = `DM-${nameWithoutSpaces}${randomNumbers}`;
  return username;
}

//deliveryman signup routes
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const generatedUsername = generateUsername(req.body.fullname);
    Deliveryman.create({
      fullname: req.body.fullname,
      contactNumber: req.body.contactNumber,
      username: generatedUsername,
      password: hashedPassword,
      email: req.body.email,
    });
    res.status(201).json({
      message: "Account created successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//deliveryman login routes
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Deliveryman.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
    //creating jwt token
    const token = jwt.sign(
      { userId: user._id, userName: user.username },
      secretKey,
      { expiresIn: "10h" }
    );
    res.status(200).json({
      token,
      userId: user._id,
      userName: user.username,
      message: "Logged in Successfully!",
    });
  } catch (error) {
    console.log("Error in Login : ", error);
    res.status(400).json({ message: "Server Error" });
  }
});

// deliveryman accepting orders.
// PUT  /accept/:orderId  order and deliveryman model will update.
router.put("/accept/:orderId", authDeliveryman, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    let order = await Order.findById(orderId);
    if (!order) {
      throw new Error();
    }
    // Check if the order is already accepted by another deliveryman
    if (order.deliveryman) {
      return res.status(400).json({ message: "Order already accepted" });
    }
    // Update order's deliveryman and set pickupDate
    order.deliveryman = req.userId;
    // order.status = "Picked up";
    await order.save();
    // Add the order to the deliveryman's orders array
    await Deliveryman.findByIdAndUpdate(req.userId, {
      $push: { orders: orderId },
    });

    res.status(200).json({ message: "Order accepted successfully" });
  } catch (error) {}
});

router.put("/pickup/:orderId", authDeliveryman, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    let order = await Order.findById(orderId);
    if (!order) {
      throw new Error();
    }
    const parcelId = order.parcel;
    let parcel = await Parcel.findById(parcelId);
    // Check if the order is already accepted by another deliveryman
    if (order.deliveryman.equals(new ObjectId(req.userId)) && order.status==="Pending") {
      order.status = "Picked up";
      order.pickupDate = new Date();
      parcel.status = "Picked up";
      await order.save();
      await parcel.save();
      return res.status(200).json({ message: "Parcel Pickedup" });
    }
  } catch (error) {
    console.log("testing error", error);
  }
});
router.put("/delivered/:orderId", authDeliveryman, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    let order = await Order.findById(orderId);
    if (!order) {
      throw new Error();
    }
    const parcelId = order.parcel;
    let parcel = await Parcel.findById(parcelId);
    // Check if the order is already accepted by another deliveryman
    if (order.deliveryman.equals(new ObjectId(req.userId)) && order.status==="Picked up") {
      order.status = "Delivered";
      order.dropDate = new Date();
      parcel.status = "Delivered";
      await order.save();
      await parcel.save();
      return res.status(200).json({ message: "Delivered" });
    }else{
      return res.status(400).json({ message: "Already delivered" });
    }
  } catch (error) {
    console.log("testing error", error);
  }
});

module.exports = router;
