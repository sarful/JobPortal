import mongoose from "mongoose";
import ContactMessage from "../models/ContactMessage.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact
 * @access  Public
 */
export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !subject?.trim() ||
    !message?.trim()
  ) {
    res.status(400);
    throw new Error(
      "Name, email, subject, and message are required."
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    res.status(400);
    throw new Error("Please provide a valid email address.");
  }

  if (name.trim().length > 100) {
    res.status(400);
    throw new Error("Name cannot exceed 100 characters.");
  }

  if (subject.trim().length > 200) {
    res.status(400);
    throw new Error("Subject cannot exceed 200 characters.");
  }

  if (message.trim().length < 10) {
    res.status(400);
    throw new Error(
      "Message must contain at least 10 characters."
    );
  }

  if (message.trim().length > 5000) {
    res.status(400);
    throw new Error("Message cannot exceed 5000 characters.");
  }

  const contactMessage = await ContactMessage.create({
    name: name.trim(),
    email: normalizedEmail,
    subject: subject.trim(),
    message: message.trim(),
    status: "new",
  });

  res.status(201).json({
    success: true,
    message:
      "Your message has been submitted successfully. We will contact you soon.",
    data: {
      contactMessage: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        status: contactMessage.status,
        createdAt: contactMessage.createdAt,
      },
    },
  });
});

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Admin
 */
export const getContactMessages = asyncHandler(async (req, res) => {
  const page = Math.max(
    Number.parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filters = {};

  if (req.query.status?.trim()) {
    filters.status = req.query.status.trim();
  }

  if (req.query.search?.trim()) {
    const searchRegex = new RegExp(
      req.query.search.trim(),
      "i"
    );

    filters.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { subject: searchRegex },
      { message: searchRegex },
    ];
  }

  const sort =
    req.query.sort === "oldest"
      ? { createdAt: 1 }
      : { createdAt: -1 };

  const [messages, totalMessages] = await Promise.all([
    ContactMessage.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),

    ContactMessage.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: {
      messages,
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        hasNextPage: page * limit < totalMessages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

/**
 * @desc    Get a single contact message
 * @route   GET /api/contact/:id
 * @access  Admin
 */
export const getContactMessageById = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid contact message ID.");
    }

    const contactMessage = await ContactMessage.findById(id);

    if (!contactMessage) {
      res.status(404);
      throw new Error("Contact message was not found.");
    }

    if (contactMessage.status === "new") {
      contactMessage.status = "read";
      await contactMessage.save();
    }

    res.status(200).json({
      success: true,
      data: {
        contactMessage,
      },
    });
  }
);

/**
 * @desc    Update contact message status
 * @route   PATCH /api/contact/:id/status
 * @access  Admin
 */
export const updateContactMessageStatus = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid contact message ID.");
    }

    const allowedStatuses = [
      "new",
      "read",
      "replied",
      "closed",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(
        "Status must be new, read, replied, or closed."
      );
    }

    const contactMessage = await ContactMessage.findById(id);

    if (!contactMessage) {
      res.status(404);
      throw new Error("Contact message was not found.");
    }

    contactMessage.status = status;

    if (status === "replied") {
      contactMessage.repliedAt = new Date();
      contactMessage.repliedBy = req.user._id;
    }

    if (status !== "replied") {
      contactMessage.repliedAt = undefined;
      contactMessage.repliedBy = undefined;
    }

    await contactMessage.save();

    res.status(200).json({
      success: true,
      message: "Contact message status updated successfully.",
      data: {
        contactMessage,
      },
    });
  }
);

/**
 * @desc    Delete a contact message
 * @route   DELETE /api/contact/:id
 * @access  Admin
 */
export const deleteContactMessage = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid contact message ID.");
    }

    const contactMessage = await ContactMessage.findById(id);

    if (!contactMessage) {
      res.status(404);
      throw new Error("Contact message was not found.");
    }

    await contactMessage.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  }
);