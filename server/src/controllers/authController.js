import bcrypt from "bcryptjs";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register a new candidate or employer
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    role = "candidate",
    phone,
    companyName,
  } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error(
      "Name, email, password, and confirm password are required."
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRole = role.trim().toLowerCase();

  if (!["candidate", "employer"].includes(normalizedRole)) {
    res.status(400);
    throw new Error("Role must be either candidate or employer.");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must contain at least 8 characters.");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Password and confirm password do not match.");
  }

  if (normalizedRole === "employer" && !companyName?.trim()) {
    res.status(400);
    throw new Error("Company name is required for employer accounts.");
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    res.status(409);
    throw new Error("An account already exists with this email address.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: normalizedRole,
    phone: phone?.trim() || undefined,
    companyProfile:
      normalizedRole === "employer"
        ? {
            companyName: companyName.trim(),
          }
        : undefined,
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: "Registration completed successfully.",
    data: {
      token,
      user: formatUserResponse(user),
    },
  });
});

/**
 * @desc    Authenticate user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error(
      "Your account has been blocked. Please contact the administrator."
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user._id, user.role);

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: formatUserResponse(user),
    },
  });
});

/**
 * @desc    Get currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User account was not found.");
  }

  if (user.isBlocked) {
    res.status(403);
    throw new Error(
      "Your account has been blocked. Please contact the administrator."
    );
  }

  res.status(200).json({
    success: true,
    data: {
      user: formatUserResponse(user),
    },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Logout successful. Remove the JWT token from the client application.",
  });
});

/**
 * Create a safe user response without exposing the password.
 */
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || null,
  profileImage: user.profileImage || null,
  professionalTitle: user.professionalTitle || null,
  location: user.location || null,
  companyProfile: user.companyProfile || null,
  isBlocked: Boolean(user.isBlocked),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});