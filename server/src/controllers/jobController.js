import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Build MongoDB query filters from request query parameters.
 */
const buildJobFilters = (query) => {
  const {
    search,
    category,
    jobType,
    workplaceType,
    location,
    experienceLevel,
    status,
    salaryMin,
    salaryMax,
  } = query;

  const filters = {};

  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filters.$or = [
      { title: searchRegex },
      { companyName: searchRegex },
      { location: searchRegex },
      { skills: searchRegex },
    ];
  }

  if (category?.trim()) {
    filters.category = category.trim();
  }

  if (jobType?.trim()) {
    filters.jobType = jobType.trim();
  }

  if (workplaceType?.trim()) {
    filters.workplaceType = workplaceType.trim();
  }

  if (location?.trim()) {
    filters.location = new RegExp(location.trim(), "i");
  }

  if (experienceLevel?.trim()) {
    filters.experienceLevel = experienceLevel.trim();
  }

  if (status?.trim()) {
    filters.status = status.trim();
  }

  if (salaryMin !== undefined || salaryMax !== undefined) {
    filters.salaryMax = {};

    if (salaryMin !== undefined && !Number.isNaN(Number(salaryMin))) {
      filters.salaryMax.$gte = Number(salaryMin);
    }

    if (salaryMax !== undefined && !Number.isNaN(Number(salaryMax))) {
      filters.salaryMax.$lte = Number(salaryMax);
    }

    if (Object.keys(filters.salaryMax).length === 0) {
      delete filters.salaryMax;
    }
  }

  return filters;
};

/**
 * Build MongoDB sort options.
 */
const buildSortOptions = (sort) => {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };

    case "salary-high":
      return { salaryMax: -1, createdAt: -1 };

    case "salary-low":
      return { salaryMin: 1, createdAt: -1 };

    case "deadline":
      return { deadline: 1 };

    case "newest":
    default:
      return { createdAt: -1 };
  }
};

/**
 * Check whether the authenticated user owns the job.
 */
const isJobOwner = (job, user) =>
  job.createdBy.toString() === user._id.toString();

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Employer/Admin
 */
export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    companyName,
    companyLogo,
    category,
    jobType,
    workplaceType,
    location,
    salaryMin,
    salaryMax,
    salaryCurrency = "BDT",
    salaryPeriod = "monthly",
    description,
    responsibilities,
    requirements,
    skills,
    experienceLevel,
    educationLevel,
    vacancies = 1,
    deadline,
    status = "active",
  } = req.body;

  if (
    !title?.trim() ||
    !companyName?.trim() ||
    !category?.trim() ||
    !jobType?.trim() ||
    !workplaceType?.trim() ||
    !description?.trim() ||
    !deadline
  ) {
    res.status(400);
    throw new Error(
      "Title, company name, category, job type, workplace type, description, and deadline are required."
    );
  }

  if (
    workplaceType !== "remote" &&
    (!location || !String(location).trim())
  ) {
    res.status(400);
    throw new Error("Location is required for on-site and hybrid jobs.");
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    res.status(400);
    throw new Error("Invalid application deadline.");
  }

  if (deadlineDate <= new Date()) {
    res.status(400);
    throw new Error("Application deadline must be a future date.");
  }

  const parsedSalaryMin =
    salaryMin === undefined || salaryMin === ""
      ? null
      : Number(salaryMin);

  const parsedSalaryMax =
    salaryMax === undefined || salaryMax === ""
      ? null
      : Number(salaryMax);

  if (
    parsedSalaryMin !== null &&
    (Number.isNaN(parsedSalaryMin) || parsedSalaryMin < 0)
  ) {
    res.status(400);
    throw new Error("Minimum salary must be a valid positive number.");
  }

  if (
    parsedSalaryMax !== null &&
    (Number.isNaN(parsedSalaryMax) || parsedSalaryMax < 0)
  ) {
    res.status(400);
    throw new Error("Maximum salary must be a valid positive number.");
  }

  if (
    parsedSalaryMin !== null &&
    parsedSalaryMax !== null &&
    parsedSalaryMin > parsedSalaryMax
  ) {
    res.status(400);
    throw new Error(
      "Minimum salary cannot be greater than maximum salary."
    );
  }

  const parsedVacancies = Number(vacancies);

  if (
    !Number.isInteger(parsedVacancies) ||
    parsedVacancies < 1
  ) {
    res.status(400);
    throw new Error("Vacancies must be a positive whole number.");
  }

  const allowedStatuses = ["draft", "active", "closed"];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid job status.");
  }

  const job = await Job.create({
    title: title.trim(),
    companyName: companyName.trim(),
    companyLogo: companyLogo?.trim() || null,
    category: category.trim(),
    jobType: jobType.trim(),
    workplaceType: workplaceType.trim(),
    location:
      workplaceType === "remote"
        ? location?.trim() || "Remote"
        : location.trim(),
    salaryMin: parsedSalaryMin,
    salaryMax: parsedSalaryMax,
    salaryCurrency,
    salaryPeriod,
    description: description.trim(),
    responsibilities: Array.isArray(responsibilities)
      ? responsibilities
          .map((item) => String(item).trim())
          .filter(Boolean)
      : [],
    requirements: Array.isArray(requirements)
      ? requirements
          .map((item) => String(item).trim())
          .filter(Boolean)
      : [],
    skills: Array.isArray(skills)
      ? skills.map((item) => String(item).trim()).filter(Boolean)
      : [],
    experienceLevel: experienceLevel?.trim() || null,
    educationLevel: educationLevel?.trim() || null,
    vacancies: parsedVacancies,
    deadline: deadlineDate,
    status,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Job created successfully.",
    data: {
      job,
    },
  });
});

/**
 * @desc    Get all public jobs
 * @route   GET /api/jobs
 * @access  Public
 */
export const getAllJobs = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filters = buildJobFilters(req.query);

  if (!req.query.status) {
    filters.status = "active";
  }

  filters.deadline = {
    $gte: new Date(),
  };

  const sortOptions = buildSortOptions(req.query.sort);

  const [jobs, totalJobs] = await Promise.all([
    Job.find(filters)
      .populate(
        "createdBy",
        "name email companyProfile profileImage"
      )
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),

    Job.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: {
      jobs,
      pagination: {
        page,
        limit,
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        hasNextPage: page * limit < totalJobs,
        hasPreviousPage: page > 1,
      },
    },
  });
});

/**
 * @desc    Get latest active jobs
 * @route   GET /api/jobs/latest
 * @access  Public
 */
export const getLatestJobs = asyncHandler(async (req, res) => {
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 6, 1),
    20
  );

  const jobs = await Job.find({
    status: "active",
    deadline: {
      $gte: new Date(),
    },
  })
    .populate(
      "createdBy",
      "name companyProfile profileImage"
    )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      jobs,
    },
  });
});

/**
 * @desc    Get one job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid job ID.");
  }

  const job = await Job.findById(id)
    .populate(
      "createdBy",
      "name email phone profileImage companyProfile"
    )
    .lean();

  if (!job) {
    res.status(404);
    throw new Error("Job was not found.");
  }

  let hasApplied = false;
  let isOwner = false;

  if (req.user) {
    isOwner =
      job.createdBy?._id?.toString() === req.user._id.toString();

    if (req.user.role === "candidate") {
      const application = await Application.exists({
        job: job._id,
        applicant: req.user._id,
      });

      hasApplied = Boolean(application);
    }
  }

  const relatedJobs = await Job.find({
    _id: {
      $ne: job._id,
    },
    category: job.category,
    status: "active",
    deadline: {
      $gte: new Date(),
    },
  })
    .select(
      "title companyName location jobType workplaceType salaryMin salaryMax salaryCurrency deadline createdAt"
    )
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      job,
      hasApplied,
      isOwner,
      isExpired: new Date(job.deadline) < new Date(),
      relatedJobs,
    },
  });
});

/**
 * @desc    Get authenticated employer's jobs
 * @route   GET /api/jobs/my-jobs
 * @access  Employer/Admin
 */
export const getMyJobs = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filters = {
    createdBy: req.user._id,
  };

  if (req.query.status?.trim()) {
    filters.status = req.query.status.trim();
  }

  if (req.query.search?.trim()) {
    filters.title = new RegExp(req.query.search.trim(), "i");
  }

  const [jobs, totalJobs] = await Promise.all([
    Job.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "job",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationCount: {
            $size: "$applications",
          },
        },
      },
      {
        $project: {
          applications: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]),

    Job.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: {
      jobs,
      pagination: {
        page,
        limit,
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
      },
    },
  });
});

/**
 * @desc    Update a job
 * @route   PUT /api/jobs/:id
 * @access  Employer owner/Admin
 */
export const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid job ID.");
  }

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error("Job was not found.");
  }

  if (!isJobOwner(job, req.user) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not allowed to update this job.");
  }

  const editableFields = [
    "title",
    "companyName",
    "companyLogo",
    "category",
    "jobType",
    "workplaceType",
    "location",
    "salaryCurrency",
    "salaryPeriod",
    "description",
    "experienceLevel",
    "educationLevel",
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      job[field] =
        typeof req.body[field] === "string"
          ? req.body[field].trim()
          : req.body[field];
    }
  });

  if (req.body.salaryMin !== undefined) {
    const salaryMin =
      req.body.salaryMin === ""
        ? null
        : Number(req.body.salaryMin);

    if (
      salaryMin !== null &&
      (Number.isNaN(salaryMin) || salaryMin < 0)
    ) {
      res.status(400);
      throw new Error("Minimum salary must be a valid positive number.");
    }

    job.salaryMin = salaryMin;
  }

  if (req.body.salaryMax !== undefined) {
    const salaryMax =
      req.body.salaryMax === ""
        ? null
        : Number(req.body.salaryMax);

    if (
      salaryMax !== null &&
      (Number.isNaN(salaryMax) || salaryMax < 0)
    ) {
      res.status(400);
      throw new Error("Maximum salary must be a valid positive number.");
    }

    job.salaryMax = salaryMax;
  }

  if (
    job.salaryMin !== null &&
    job.salaryMax !== null &&
    job.salaryMin > job.salaryMax
  ) {
    res.status(400);
    throw new Error(
      "Minimum salary cannot be greater than maximum salary."
    );
  }

  if (req.body.vacancies !== undefined) {
    const vacancies = Number(req.body.vacancies);

    if (!Number.isInteger(vacancies) || vacancies < 1) {
      res.status(400);
      throw new Error("Vacancies must be a positive whole number.");
    }

    job.vacancies = vacancies;
  }

  if (req.body.deadline !== undefined) {
    const deadlineDate = new Date(req.body.deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      res.status(400);
      throw new Error("Invalid application deadline.");
    }

    if (deadlineDate <= new Date()) {
      res.status(400);
      throw new Error("Application deadline must be a future date.");
    }

    job.deadline = deadlineDate;
  }

  const arrayFields = [
    "responsibilities",
    "requirements",
    "skills",
  ];

  arrayFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (!Array.isArray(req.body[field])) {
        res.status(400);
        throw new Error(`${field} must be an array.`);
      }

      job[field] = req.body[field]
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  });

  if (
    job.workplaceType !== "remote" &&
    !job.location?.trim()
  ) {
    res.status(400);
    throw new Error("Location is required for on-site and hybrid jobs.");
  }

  const updatedJob = await job.save();

  res.status(200).json({
    success: true,
    message: "Job updated successfully.",
    data: {
      job: updatedJob,
    },
  });
});

/**
 * @desc    Change job status
 * @route   PATCH /api/jobs/:id/status
 * @access  Employer owner/Admin
 */
export const updateJobStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid job ID.");
  }

  const allowedStatuses = ["draft", "active", "closed"];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Status must be draft, active, or closed.");
  }

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error("Job was not found.");
  }

  if (!isJobOwner(job, req.user) && req.user.role !== "admin") {
    res.status(403);
    throw new Error(
      "You are not allowed to change this job's status."
    );
  }

  if (status === "active" && new Date(job.deadline) <= new Date()) {
    res.status(400);
    throw new Error(
      "An expired job cannot be activated. Update its deadline first."
    );
  }

  job.status = status;

  await job.save();

  res.status(200).json({
    success: true,
    message: `Job status updated to ${status}.`,
    data: {
      job,
    },
  });
});

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 * @access  Employer owner/Admin
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid job ID.");
  }

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error("Job was not found.");
  }

  if (!isJobOwner(job, req.user) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not allowed to delete this job.");
  }

  const applicationCount = await Application.countDocuments({
    job: job._id,
  });

  if (applicationCount > 0 && req.user.role !== "admin") {
    res.status(409);
    throw new Error(
      "This job has applications and cannot be deleted. Close the job instead."
    );
  }

  if (req.user.role === "admin" && applicationCount > 0) {
    await Application.deleteMany({
      job: job._id,
    });
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully.",
  });
});