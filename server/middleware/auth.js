const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const isAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bearer token required" });
  }
  try {
    const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
    const user = payload.user || payload;
    req.auth = { userId: String(user._id || user.id || payload.userId), admin: user.admin === true };
    return next();
  } catch (_error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
});

const requireAdmin = (req, res, next) => {
  if (!req.auth?.admin) return res.status(StatusCodes.FORBIDDEN).json({ message: "Administrator access required" });
  return next();
};

const requireSelf = (parameter) => (req, res, next) => {
  if (req.auth?.admin || req.auth?.userId === String(req.params[parameter])) return next();
  return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
};

const requireBodySelf = (selector) => (req, res, next) => {
  const requestedUserId = selector(req.body);
  if (req.auth?.admin || req.auth?.userId === String(requestedUserId)) return next();
  return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied" });
};

module.exports = isAuth;
module.exports.requireAdmin = requireAdmin;
module.exports.requireSelf = requireSelf;
module.exports.requireBodySelf = requireBodySelf;
