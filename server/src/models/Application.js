import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required."],
      index: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant reference is required."],
      index: true,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Employer reference is required."],
      index: true,
    },

    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required."],
      trim: true,
    },

    coverLetter: {
      type: String,
      trim: true,
      maxlength: [
        5000,
        "Cover letter cannot exceed 5000 characters.",
      ],
      default: "",
    },

    expectedSalary: {
      type: Number,
      min: [0, "Expected salary cannot be negative."],
      default: null,
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: [
          "submitted",
          "under-review",
          "shortlisted",
          "interview-scheduled",
          "selected",
          "rejected",
        ],
        message: "Invalid application status.",
      },
      default: "submitted",
      index: true,
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    interviewLocation: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "Interview location cannot exceed 500 characters.",
      ],
      default: "",
    },

    interviewNotes: {
      type: String,
      trim: true,
      maxlength: [
        3000,
        "Interview notes cannot exceed 3000 characters.",
      ],
      default: "",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

applicationSchema.index(
  {
    job: 1,
    applicant: 1,
  },
  {
    unique: true,
  }
);

applicationSchema.index({
  employer: 1,
  status: 1,
  createdAt: -1,
});

applicationSchema.index({
  applicant: 1,
  status: 1,
  createdAt: -1,
});

applicationSchema.pre("validate", function validateInterview(next) {
  if (this.status === "interview-scheduled") {
    if (!this.interviewDate) {
      return next(
        new Error(
          "Interview date is required when status is interview-scheduled."
        )
      );
    }

    if (this.interviewDate <= new Date()) {
      return next(
        new Error("Interview date must be in the future.")
      );
    }
  }

  if (this.status !== "interview-scheduled") {
    this.interviewDate = null;
    this.interviewLocation = "";
    this.interviewNotes = "";
  }

  next();
});

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;