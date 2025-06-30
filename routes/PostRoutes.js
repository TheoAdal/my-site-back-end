// routes/PostRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

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

    //create token if correct credentials
    const token = jwt.sign({ user: { _id: user._id } }, "privatekey", { expiresIn: "1h" });
    user.token = token;
    user.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // create tokenExpiry with 1 hour expiry
    await user.save();

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// Register route
router.post("/user/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //Check if email is used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    //Create new user
    const newUser = new User({ name, email, password });

    //Store user to DB
    await newUser.save();

    //Success message
    res.status(201).json({ message: "User registered successfully. Now add email verification theooooo" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
