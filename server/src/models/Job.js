import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required."],
      trim: true,
      minlength: [3, "Job title must contain at least 3 characters."],
      maxlength: [150, "Job title cannot exceed 150 characters."],
      index: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required."],
      trim: true,
      maxlength: [200, "Company name cannot exceed 200 characters."],
      index: true,
    },

    companyLogo: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: [true, "Job category is required."],
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters."],
      index: true,
    },

    jobType: {
      type: String,
      required: [true, "Job type is required."],
      enum: {
        values: [
          "full-time",
          "part-time",
          "contract",
          "internship",
          "temporary",
          "freelance",
        ],
        message: "Invalid job type.",
      },
      index: true,
    },

    workplaceType: {
      type: String,
      required: [true, "Workplace type is required."],
      enum: {
        values: ["on-site", "remote", "hybrid"],
        message: "Workplace type must be on-site, remote, or hybrid.",
      },
      index: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters."],
      default: "",
      index: true,
    },

    salaryMin: {
      type: Number,
      min: [0, "Minimum salary cannot be negative."],
      default: null,
    },

    salaryMax: {
      type: Number,
      min: [0, "Maximum salary cannot be negative."],
      default: null,
    },

    salaryCurrency: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [10, "Salary currency cannot exceed 10 characters."],
      default: "BDT",
    },

    salaryPeriod: {
      type: String,
      enum: {
        values: ["hourly", "daily", "weekly", "monthly", "yearly"],
        message: "Invalid salary period.",
      },
      default: "monthly",
    },

    description: {
      type: String,
      required: [true, "Job description is required."],
      trim: true,
      minlength: [20, "Job description must contain at least 20 characters."],
      maxlength: [15000, "Job description cannot exceed 15000 characters."],
    },

    responsibilities: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 500,
        },
      ],
      default: [],
    },

    requirements: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 500,
        },
      ],
      default: [],
    },

    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 100,
        },
      ],
      default: [],
      index: true,
    },

    experienceLevel: {
      type: String,
      enum: {
        values: [
          "entry-level",
          "junior",
          "mid-level",
          "senior",
          "lead",
          "manager",
          "director",
          "",
        ],
        message: "Invalid experience level.",
      },
      default: "",
      index: true,
    },

    educationLevel: {
      type: String,
      trim: true,
      maxlength: [150, "Education level cannot exceed 150 characters."],
      default: "",
    },

    vacancies: {
      type: Number,
      required: [true, "Number of vacancies is required."],
      min: [1, "Vacancies must be at least 1."],
      validate: {
        validator: Number.isInteger,
        message: "Vacancies must be a whole number.",
      },
      default: 1,
    },

    deadline: {
      type: Date,
      required: [true, "Application deadline is required."],
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["draft", "active", "closed"],
        message: "Status must be draft, active, or closed.",
      },
      default: "active",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Job owner is required."],
      index: true,
    },

    viewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobSchema.index({
  title: "text",
  companyName: "text",
  location: "text",
  skills: "text",
});

jobSchema.index({
  status: 1,
  deadline: 1,
  category: 1,
  jobType: 1,
  workplaceType: 1,
});

jobSchema.index({
  createdBy: 1,
  createdAt: -1,
});

jobSchema.pre("validate", function validateJob(next) {
  if (
    this.salaryMin !== null &&
    this.salaryMax !== null &&
    this.salaryMin !== undefined &&
    this.salaryMax !== undefined &&
    this.salaryMin > this.salaryMax
  ) {
    return next(
      new Error("Minimum salary cannot be greater than maximum salary.")
    );
  }

  if (
    this.workplaceType !== "remote" &&
    !this.location?.trim()
  ) {
    return next(
      new Error("Location is required for on-site and hybrid jobs.")
    );
  }

  if (
    this.workplaceType === "remote" &&
    !this.location?.trim()
  ) {
    this.location = "Remote";
  }

  if (
    this.status === "active" &&
    this.deadline &&
    this.deadline <= new Date()
  ) {
    return next(
      new Error("An active job must have a future application deadline.")
    );
  }

  next();
});

jobSchema.virtual("isExpired").get(function getIsExpired() {
  return Boolean(this.deadline && this.deadline <= new Date());
});

jobSchema.set("toJSON", {
  virtuals: true,
});

jobSchema.set("toObject", {
  virtuals: true,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;