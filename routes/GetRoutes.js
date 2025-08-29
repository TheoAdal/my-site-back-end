// routes/GetRoutes.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");

// Route to get all users
router.get("/getall", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("_id name email password");

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



module.exports = router;