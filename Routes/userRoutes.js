const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const authGuard = require("../Middleware/authGuard");
const secretKey = "rafiul"; // give it .env file letter for protection
// user signup routes
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.create({
      //   fullname: req.body.fullname,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      //   contactNumber: req.body.contactNumber,
      //   address: req.body.address,
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
      { expiresIn: "1h" }
    );
    //659555377672f6fe098eebae
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTk1NTUzNzc2NzJmNmZlMDk4ZWViYWUiLCJ1c2VyTmFtZSI6ImFkbWluIiwiaWF0IjoxNzA0Mjk4NDcwLCJleHAiOjE3MDQzMDIwNzB9.50UOBxcVLVKCMBcnjBFn1P1xh2PHEnr0PnyhoEinUmA
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
      const userData = await User.findById(userId, "-password");
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
//test
router.get("/profile", async (req, res) => {
  res.json({
    message: "Hello. this is profile"
  })
});

module.exports = router;
