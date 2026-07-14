import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    degree: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: true,
  }
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    position: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    _id: true,
  }
);

const companyProfileSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    companyLogo: {
      type: String,
      trim: true,
    },
    companyEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    companySize: {
      type: String,
      trim: true,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1001-5000",
        "5001+",
        "",
      ],
      default: "",
    },
    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    twitterUrl: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must contain at least 8 characters."],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["candidate", "employer", "admin"],
        message: "Role must be candidate, employer, or admin.",
      },
      default: "candidate",
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters."],
    },

    profileImage: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters."],
    },

    professionalTitle: {
      type: String,
      trim: true,
      maxlength: [
        150,
        "Professional title cannot exceed 150 characters.",
      ],
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [3000, "Biography cannot exceed 3000 characters."],
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
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },

    companyProfile: {
      type: companyProfileSchema,
      default: undefined,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({
  name: "text",
  email: "text",
  professionalTitle: "text",
  skills: "text",
});

userSchema.pre("save", function validateEmployerProfile(next) {
  if (
    this.role === "employer" &&
    !this.companyProfile?.companyName?.trim()
  ) {
    return next(
      new Error("Company name is required for employer accounts.")
    );
  }

  next();
});

userSchema.set("toJSON", {
  transform(document, returnedObject) {
    delete returnedObject.password;
    return returnedObject;
  },
});

const User = mongoose.model("User", userSchema);

export default User;