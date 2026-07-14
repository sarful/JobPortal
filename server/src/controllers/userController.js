import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Remove sensitive fields before returning user data.
 */
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || null,
  profileImage: user.profileImage || null,
  location: user.location || null,
  professionalTitle: user.professionalTitle || null,
  bio: user.bio || null,
  skills: user.skills || [],
  education: user.education || [],
  experience: user.experience || [],
  resumeUrl: user.resumeUrl || null,
  portfolioUrl: user.portfolioUrl || null,
  linkedinUrl: user.linkedinUrl || null,
  companyProfile: user.companyProfile || null,
  isBlocked: Boolean(user.isBlocked),
  lastLoginAt: user.lastLoginAt || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * @desc    Get authenticated user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User profile was not found.");
  }

  res.status(200).json({
    success: true,
    data: {
      user: formatUserResponse(user),
    },
  });
});

/**
 * @desc    Update authenticated user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User profile was not found.");
  }

  const {
    name,
    phone,
    profileImage,
    location,
    professionalTitle,
    bio,
    skills,
    education,
    experience,
    resumeUrl,
    portfolioUrl,
    linkedinUrl,
    companyProfile,
  } = req.body;

  if (name !== undefined) {
    const trimmedName = String(name).trim();

    if (!trimmedName) {
      res.status(400);
      throw new Error("Name cannot be empty.");
    }

    user.name = trimmedName;
  }

  if (phone !== undefined) {
    user.phone = String(phone).trim();
  }

  if (profileImage !== undefined) {
    user.profileImage = String(profileImage).trim();
  }

  if (location !== undefined) {
    user.location = String(location).trim();
  }

  if (professionalTitle !== undefined) {
    user.professionalTitle = String(professionalTitle).trim();
  }

  if (bio !== undefined) {
    user.bio = String(bio).trim();
  }

  if (resumeUrl !== undefined) {
    user.resumeUrl = String(resumeUrl).trim();
  }

  if (portfolioUrl !== undefined) {
    user.portfolioUrl = String(portfolioUrl).trim();
  }

  if (linkedinUrl !== undefined) {
    user.linkedinUrl = String(linkedinUrl).trim();
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      res.status(400);
      throw new Error("Skills must be an array.");
    }

    user.skills = skills
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  }

  if (education !== undefined) {
    if (!Array.isArray(education)) {
      res.status(400);
      throw new Error("Education must be an array.");
    }

    user.education = education;
  }

  if (experience !== undefined) {
    if (!Array.isArray(experience)) {
      res.status(400);
      throw new Error("Experience must be an array.");
    }

    user.experience = experience;
  }

  if (companyProfile !== undefined) {
    if (user.role !== "employer") {
      res.status(403);
      throw new Error(
        "Only employer accounts can update a company profile."
      );
    }

    if (
      typeof companyProfile !== "object" ||
      companyProfile === null ||
      Array.isArray(companyProfile)
    ) {
      res.status(400);
      throw new Error("Company profile must be a valid object.");
    }

    user.companyProfile = {
      ...(user.companyProfile?.toObject?.() || user.companyProfile || {}),
      ...companyProfile,
    };
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: {
      user: formatUserResponse(updatedUser),
    },
  });
});

/**
 * @desc    Change authenticated user's password
 * @route   PUT /api/users/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const {
    currentPassword,
    newPassword,
    confirmNewPassword,
  } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    res.status(400);
    throw new Error(
      "Current password, new password, and password confirmation are required."
    );
  }

  if (newPassword.length < 8) {
    res.status(400);
    throw new Error("New password must contain at least 8 characters.");
  }

  if (newPassword !== confirmNewPassword) {
    res.status(400);
    throw new Error("New password and confirmation do not match.");
  }

  if (currentPassword === newPassword) {
    res.status(400);
    throw new Error(
      "New password must be different from the current password."
    );
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User account was not found.");
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordMatches) {
    res.status(401);
    throw new Error("Current password is incorrect.");
  }

  user.password = await bcrypt.hash(newPassword, 12);

  await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

/**
 * @desc    Get a public user profile by ID
 * @route   GET /api/users/:id
 * @access  Public or Private
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid user ID.");
  }

  const user = await User.findById(id).select(
    "name role profileImage location professionalTitle bio skills education experience portfolioUrl linkedinUrl companyProfile createdAt"
  );

  if (!user) {
    res.status(404);
    throw new Error("User was not found.");
  }

  if (user.isBlocked) {
    res.status(404);
    throw new Error("User was not found.");
  }

  const publicUser = {
    id: user._id,
    name: user.name,
    role: user.role,
    profileImage: user.profileImage || null,
    location: user.location || null,
    professionalTitle: user.professionalTitle || null,
    bio: user.bio || null,
    skills: user.skills || [],
    education: user.education || [],
    experience: user.experience || [],
    portfolioUrl: user.portfolioUrl || null,
    linkedinUrl: user.linkedinUrl || null,
    companyProfile:
      user.role === "employer" ? user.companyProfile || null : null,
    createdAt: user.createdAt,
  };

  res.status(200).json({
    success: true,
    data: {
      user: publicUser,
    },
  });
});

/**
 * @desc    Delete authenticated user's own account
 * @route   DELETE /api/users/profile
 * @access  Private
 */
export const deleteOwnAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error(
      "Password is required to delete your account."
    );
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User account was not found.");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    res.status(401);
    throw new Error("Password is incorrect.");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "Your account was deleted successfully.",
  });
});