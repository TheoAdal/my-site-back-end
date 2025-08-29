// routes/ProtectedGetRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const checkToken = require('../middleware/checkToken');

//AUTH: Token check
router.get("/user/token", checkToken, (req, res) => {
    res.json({
        code:"TOKEN_CHECK_SUCCESFULL",
        message: "Token check was succesfull",
        authorizedData: req.user,
    });
});

//AUTH: Route to get all users 
router.get("/user/getall", checkToken, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("_id name email");

    // Check if no users are found
    if (users.length === 0) {
      return res.status(404).json({message: "User not found", code: "USER_NOT_FOUND"});
    }

    // Send the found users
    res.send(users);
  } catch (err) {
    console.error("Error fetching all users:", err); 
    res.status(500).json({message: "Internal Server Error", code:"INTERNAL_SERVER_ERROR"});
  }
});

// //AUTH: Route to get 
router.get("/user/:username", checkToken, async (req, res) => {
  try {
    const profileUser = await User.findOne({ username: req.params.username }).select("_id name username email ");

    if (!profileUser) {
      return res.status(404).json({message: "User not found", code: "USER_NOT_FOUND"});
    }

    // Check if the logged-in user is visiting their own profile
    const isOwner = req.user && req.user.id === profileUser._id.toString();

    // Return only public fields + ownership flag
    res.json({
      name: profileUser.name,
      username: profileUser.username,
      isOwner,
      ...(isOwner ? { email: profileUser.email } : {}) // include email only if it's their own
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error", code:"SERVER_ERROR"});
  }
});


module.exports = router;