import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
      index: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required."],
      trim: true,
      minlength: [3, "Subject must contain at least 3 characters."],
      maxlength: [200, "Subject cannot exceed 200 characters."],
    },

    message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
      minlength: [10, "Message must contain at least 10 characters."],
      maxlength: [5000, "Message cannot exceed 5000 characters."],
    },

    status: {
      type: String,
      enum: {
        values: ["new", "read", "replied", "closed"],
        message: "Status must be new, read, replied, or closed.",
      },
      default: "new",
      index: true,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactMessageSchema.index({
  status: 1,
  createdAt: -1,
});

contactMessageSchema.index({
  name: "text",
  email: "text",
  subject: "text",
  message: "text",
});

contactMessageSchema.pre("validate", function validateReplyFields(next) {
  if (this.status === "replied" && !this.repliedAt) {
    this.repliedAt = new Date();
  }

  if (this.status !== "replied") {
    this.repliedAt = null;
    this.repliedBy = null;
  }

  next();
});

const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);

export default ContactMessage;