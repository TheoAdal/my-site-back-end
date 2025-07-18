// middleware/isOwner.js

module.exports = function isOwnerByUsername(req, res, next) {
  const { username } = req.params;

  if (!req.user || req.user.username !== username) {
    return res.status(403).json({ message: "Access denied: Not your profile" });
  }

  next();
};
