// routes/TokenBasedRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const sendEmail = require("../utilities/SendEmail");
const sendPass = require("../utilities/SendPass");

//Route to verify user email
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Missing verification token", code:"MISSING_VERIFICATION_TOKEN" });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // check if still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token", code:"INVALID||EXPIRED_VERIFICATION_TOKEN" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in.", code:"EMAIL_VERIFIED" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Server error during verification", code:"SERVER_ERROR" });
  }
});

//Route to resend email verification to user email
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    //Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({message: "User not found", code: "USER_NOT_FOUND"});
    }

    //Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "Account already verified", code:"ACCOUNT_ALREADY_VERIFIED" });
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
    res.status(500).json({message: "Internal Server Error", code:"INTERNAL_SERVER_ERROR"});
  }
});

//Route to send password reset link to user email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "There is no account with this email", code:"USER_EMAIL_NOT_FOUND"
      });
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Update the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;

    await user.save(); // Only one save is needed

    // Create password reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Send the email
    await sendPass(user.email, resetLink);

    return res.status(200).json({
      message: "Reset Password email sent successfully", code:"RESET_EMAIL_SENT"
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({message: "Internal Server Error", code:"INTERNAL_SERVER_ERROR"});
  }
});

//Route for user to reset password
router.patch("/reset-password/:token", async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset token", code:"INVALID||EXPIRED_RESET_TOKEN" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save(); 

    return res.status(200).json({
      message: "Your password has been successfully reset.", code:"PASSWORD_RESET"
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({
      message: "Server error while resetting password.", code:"INTERNAL_SERVER_ERROR"
    });
  }
});

module.exports = router;