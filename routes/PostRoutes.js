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
      return res.status(401).json({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }
    //Check Password with "comparePassword" method from "User" model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }
    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    //Create token if correct credentials
    const token = jwt.sign({ user: { _id: user._id } }, "privatekey", {
      expiresIn: "1h",
    });
    user.token = token;
    user.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // create tokenExpiry with 1 hour expiry
    //Store it in the DB
    await user.save();

    return res.status(200).json({
      message: "User logged in successfully",
      access_token: token,
      user: {
        id: user._id,
        name: user.name, // assuming you store it
        email: user.email,
        // role: user.role, // optional if you use roles
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error",
      code: "SERVER_ERROR",
    });
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
    const verificationLink = `http://localhost:3000/verify/${verificationToken}`;

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

router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    //Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "Account already verified" });
    }

    //Generate a new token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 hour

    user.verificationToken = token;
    user.verificationTokenExpiry = expiry;

    await user.save();

    //Create verification link and send email
    const verificationLink = `http://localhost:3000/verify/${token}`;
    await sendEmail(user.email, verificationLink);

    res.json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
