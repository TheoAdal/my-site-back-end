// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // surname: {
  //   type: String,
  //   required: true
  // },
  username: { 
    type: String, 
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // country: {
  //   type: String,
  //   required: true
  // },
  password: {
    type: String,
    required: true,
  },
  // role: {
  //   type: String,
  //   required: true
  // },
  // gender: {
  //   type: String,
  //   required: true
  // },
  verified: {
    type: Boolean,
    default: false,
  },
  // SESSION, VERIFICATION & PASSWORD_RESET TOKENS BELOW //
  token: {
    type: String,
    default: null,
  },
  tokenExpiry: {
    type: Date, 
    default: null,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  resetPasswordToken: {
    type: String ,
    required: false
  },
  resetPasswordExpires: {
    type: Date ,
    required: false
  },
});

//Before storing user cred, the password gets hashed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

//Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
