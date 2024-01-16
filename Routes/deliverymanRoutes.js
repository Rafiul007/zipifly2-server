const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "deliveryman";
const router = express.Router();
const Deliveryman = require("../Model/deliverMan.model");

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
      email: req.body.email
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

module.exports = router;
