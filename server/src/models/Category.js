import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      minlength: [2, "Category name must contain at least 2 characters."],
      maxlength: [100, "Category name cannot exceed 100 characters."],
      unique: true,
      index: true,
    },

    slug: {
      type: String,
      required: [true, "Category slug is required."],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Category slug must contain only lowercase letters, numbers, and hyphens.",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters."],
      default: "",
    },

    icon: {
      type: String,
      trim: true,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.pre("validate", function createSlug(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  next();
});

categorySchema.index({
  isActive: 1,
  name: 1,
});

const Category = mongoose.model("Category", categorySchema);

export default Category;