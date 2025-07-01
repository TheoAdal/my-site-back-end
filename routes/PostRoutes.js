// routes/PostRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const sendEmail = require("../utilities/SendEmail");
const sendPass = require("../utilities/SendPass");

//Login route
router.post("/user/login", async (req, res, next) => {
  const { body } = req;

  const { email } = body;
  const { password } = body;

  try {
    //Check Email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //Check Password with "comparePassword" method from "User" model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    //Create token if correct credentials
    const token = jwt.sign({ user: { _id: user._id } }, "privatekey", {
      expiresIn: "1h",
    });
    user.token = token;
    user.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // create tokenExpiry with 1 hour expiry
    //Store it in the DB
    await user.save();

    res.status(201).json({ message: "User logged in successfully. " });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

//Register route || Add email verification
router.post("/user/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //Check if email is used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create verification link
    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;

    //Create new user
    const newUser = new User({
      name,
      email,
      password, //hashed with pre-save in User model
      verificationToken,
      verificationTokenExpires: Date.now() + 3600000, // 1 hour
    });

    //Store user to DB
    await newUser.save();

    try {
      await sendEmail(newUser.email, verificationLink);
      //Success message
      return res.status(200).json({ message: "User registered successfully. Please check your email to verify." });
    } catch (emailErr) {
      console.error("Email not sent", emailErr);
      return res.status(500).json({ message: "User created, but verification email failed." });
    }

  } catch (err) { 
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }

  
});

module.exports = router;
