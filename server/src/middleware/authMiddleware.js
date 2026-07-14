import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Protect private routes by verifying the JWT token.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authorizationHeader = req.headers.authorization;

  if (
    authorizationHeader &&
    authorizationHeader.startsWith("Bearer ")
  ) {
    token = authorizationHeader.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error("Authentication required. Please log in.");
  }

  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("JWT_SECRET is not configured on the server.");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);

    if (error.name === "TokenExpiredError") {
      throw new Error("Your session has expired. Please log in again.");
    }

    throw new Error("Invalid authentication token.");
  }

  const userId = decoded.userId || decoded.id || decoded.sub;

  if (!userId) {
    res.status(401);
    throw new Error("Invalid token payload.");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(401);
    throw new Error(
      "The user associated with this token no longer exists."
    );
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error(
      "Your account has been blocked. Please contact the administrator."
    );
  }

  req.user = user;
  req.token = token;

  next();
});

/**
 * Optional authentication middleware.
 *
 * Public routes can use this middleware when they need user-specific
 * information without requiring login.
 */
export const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  const authorizationHeader = req.headers.authorization;

  if (
    authorizationHeader &&
    authorizationHeader.startsWith("Bearer ")
  ) {
    token = authorizationHeader.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    req.user = null;
    return next();
  }

  if (!process.env.JWT_SECRET) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded.sub;

    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(userId).select("-password");

    if (!user || user.isBlocked) {
      req.user = null;
      return next();
    }

    req.user = user;
    req.token = token;

    return next();
  } catch {
    req.user = null;
    return next();
  }
});