// routes/ProtectedPatchRoutes.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");

const checkToken = require('../middleware/checkToken');
const isOwnerByUsername = require("../middleware/isOwner");


//AUTH: Edit user profile
router.patch("/update/:id", checkToken, isOwnerByUsername, async (req, res) => {
  try {
    // Prevent email & password from updating 
    const { email, password, ...updates } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true, // ensures validation 
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ message: "Failed to update profile", error: err.message });
  }
});


module.exports = router;