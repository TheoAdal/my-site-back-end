// routes/GetRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Route to get all users
router.get("/getall", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("_id name email");

    // Check if no users are found
    if (users.length === 0) {
      return res.status(404).send("No User Found");
    }

    // Send the found users
    res.send(users);
  } catch (err) {
    console.error("Error fetching all users:", err); 
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;