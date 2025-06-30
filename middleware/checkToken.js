// middleware/checkToken.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function checkToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.sendStatus(403);

  const token = bearerHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "privatekey");

    const user = await User.findById(decoded.user._id);
    if (!user || user.token !== token) {
      return res.status(403).json({ message: "Token invalid or expired" });
    }

    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Unauthorized" });
  }
}

module.exports = checkToken;
