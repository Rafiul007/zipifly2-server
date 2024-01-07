const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const authGuard = require("../Middleware/authGuard");
const secretKey = "rafiul"; // give it .env file letter for protection

// Function to generate a username with 3 random numbers
function generateUsername(name) {
  // Remove spaces from the name
  const nameWithoutSpaces = name.replace(/\s/g, "");
  // Generate 3 random numbers between 100 and 999
  const randomNumbers = Math.floor(100 + Math.random() * 900);
  // Concatenate the formatted name and random numbers to form the username
  const username = `${nameWithoutSpaces}${randomNumbers}`;
  return username;
}
// user signup routes
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const generatedUsername = generateUsername(req.body.fullname);
    User.create({
      fullname: req.body.fullname,
      username: generatedUsername,
      password: hashedPassword,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      district: req.body.district,
    });
    res.status(201).json({
      message: "User created successfully!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//user login routes
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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

//user profile data
router.get("/profile/:userId", authGuard, async (req, res) => {
  const userId = req.params.userId;
  // if (userId !== req.userId) {
  //   return res.status(403).json({ message: "Forbidden!" });
  // } else {
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(userData);
  } catch (err) {
    console.log("Profile Error : ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  // }
});
// GET method:  all the parcel of a specific user who is logged in
router.get("/parcels", authGuard, async (req, res) => {
  let userId = req.userId; // userId to find his parcels only
  // Find all parcels where either sender or receiver is the specified user
  try {
    const userParcels = await Parcel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate({
        path: "sender",
        select: "username email", // Specify the fields you want to include from sender
      })
      .populate({
        path: "receiver",
        select: "username email", // Specify the fields you want to include from receiver
      })
      .exec();

    res.status(200).json(userParcels);
  } catch (error) {
    console.log("Parcel Error", error);
  }
});
//test
router.get("/profile", async (req, res) => {
  res.json({
    message: "Hello. this is profile, Testing testing",
  });
});

module.exports = router;
