// models/User.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verified:{ 
    type: Boolean,
    required: false,
  },
  resetPasswordToken: { // This will store the password reset token
    type: String ,
    required: false 
  },  
  resetPasswordExpires: { // This will store the expiry time of the token
    type: Date ,
    required: false 
  },  
});

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;