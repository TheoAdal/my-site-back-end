// routes/ProtectedPatchRoutes.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const checkToken = require('../middleware/checkToken');


//AUTH: Edit user
router.patch("/user/edit/:id", checkToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({ message: "Profile edit was successful" });
    res.send(user);
  } catch (err) {
    console.error("Profile edit error:", err);
    res.status(500).send("Profile edit failed");
  }
});

module.exports = router;