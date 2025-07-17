// routes/ProtectedPostRoutes.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const checkToken = require('../middleware/checkToken');

//AUTH: Logout user
router.post("/user/logout", checkToken, async (req, res) => {
  try {
    const user = req.user;
    user.token = null;
    user.tokenExpiry = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).send("Logout failed");
  }
});

module.exports = router;