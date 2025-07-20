// middleware/isOwner.js

module.exports = function isOwnerByUsername(req, res, next) {
  const { id } = req.params;

  if (!req.user || req.user._id.toString() !== id) {
    return res.status(403).json({ message: "Access denied: Not your profile" });
  }

  next();
};
