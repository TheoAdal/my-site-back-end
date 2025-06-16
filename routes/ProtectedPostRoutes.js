// routes/ProtectedPostRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const checkToken = require('../middleware/checkToken');


module.exports = router;