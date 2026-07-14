import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Apply for a job
 * @route   POST /api/jobs/:jobId/apply
 * @access  Candidate
 */
export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const {
    resumeUrl,
    coverLetter,
    expectedSalary,
    portfolioUrl,
  } = req.body;

  if (!mongoose.isValidObjectId(jobId)) {
    res.status(400);
    throw new Error("Invalid job ID.");
  }

  if (req.user.role !== "candidate") {
    res.status(403);
    throw new Error("Only candidates can apply for jobs.");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job was not found.");
  }

  if (job.createdBy.toString() === req.user._id.toString()) {
    res.status(403);
    throw new Error("You cannot apply for your own job.");
  }

  if (job.status !== "active") {
    res.status(400);
    throw new Error("This job is not currently accepting applications.");
  }

  if (new Date(job.deadline) <= new Date()) {
    res.status(400);
    throw new Error("The application deadline has passed.");
  }

  const existingApplication = await Application.findOne({
    job: job._id,
    applicant: req.user._id,
  });

  if (existingApplication) {
    res.status(409);
    throw new Error("You have already applied for this job.");
  }

  if (!resumeUrl?.trim()) {
    res.status(400);
    throw new Error("Resume URL is required.");
  }

  let parsedExpectedSalary = null;

  if (
    expectedSalary !== undefined &&
    expectedSalary !== null &&
    expectedSalary !== ""
  ) {
    parsedExpectedSalary = Number(expectedSalary);

    if (
      Number.isNaN(parsedExpectedSalary) ||
      parsedExpectedSalary < 0
    ) {
      res.status(400);
      throw new Error("Expected salary must be a valid positive number.");
    }
  }

  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    employer: job.createdBy,
    resumeUrl: resumeUrl.trim(),
    coverLetter: coverLetter?.trim() || "",
    expectedSalary: parsedExpectedSalary,
    portfolioUrl: portfolioUrl?.trim() || "",
    status: "submitted",
  });

  const populatedApplication = await Application.findById(
    application._id
  )
    .populate(
      "job",
      "title companyName location jobType workplaceType deadline status"
    )
    .populate(
      "applicant",
      "name email phone profileImage professionalTitle"
    )
    .lean();

  res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    data: {
      application: populatedApplication,
    },
  });
});

/**
 * @desc    Get authenticated candidate's applications
 * @route   GET /api/applications/my-applications
 * @access  Candidate
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== "candidate") {
    res.status(403);
    throw new Error("Only candidates can view personal applications.");
  }

  const page = Math.max(
    Number.parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filters = {
    applicant: req.user._id,
  };

  if (req.query.status?.trim()) {
    filters.status = req.query.status.trim();
  }

  const [applications, totalApplications] = await Promise.all([
    Application.find(filters)
      .populate(
        "job",
        "title companyName companyLogo location jobType workplaceType salaryMin salaryMax salaryCurrency deadline status createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Application.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: {
      applications,
      pagination: {
        page,
        limit,
        totalApplications,
        totalPages: Math.ceil(totalApplications / limit),
        hasNextPage: page * limit < totalApplications,
        hasPreviousPage: page > 1,
      },
    },
  });
});

/**
 * @desc    Get all applications for one job
 * @route   GET /api/jobs/:jobId/applications
 * @access  Job owner/Admin
 */
export const getJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.isValidObjectId(jobId)) {
    res.status(400);
    throw new Error("Invalid job ID.");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job was not found.");
  }

  const isOwner =
    job.createdBy.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error(
      "You are not allowed to view applications for this job."
    );
  }

  const page = Math.max(
    Number.parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  const filters = {
    job: job._id,
  };

  if (req.query.status?.trim()) {
    filters.status = req.query.status.trim();
  }

  if (req.query.search?.trim()) {
    const searchRegex = new RegExp(req.query.search.trim(), "i");

    const candidateIds = await mongoose
      .model("User")
      .find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { professionalTitle: searchRegex },
        ],
      })
      .distinct("_id");

    filters.applicant = {
      $in: candidateIds,
    };
  }

  const [applications, totalApplications] = await Promise.all([
    Application.find(filters)
      .populate(
        "applicant",
        "name email phone profileImage professionalTitle location skills resumeUrl portfolioUrl linkedinUrl"
      )
      .populate(
        "job",
        "title companyName location jobType deadline status"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Application.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: {
      job: {
        id: job._id,
        title: job.title,
        companyName: job.companyName,
        status: job.status,
      },
      applications,
      pagination: {
        page,
        limit,
        totalApplications,
        totalPages: Math.ceil(totalApplications / limit),
        hasNextPage: page * limit < totalApplications,
        hasPreviousPage: page > 1,
      },
    },
  });
});

/**
 * @desc    Get one application
 * @route   GET /api/applications/:id
 * @access  Applicant, job owner, or Admin
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid application ID.");
  }

  const application = await Application.findById(id)
    .populate(
      "applicant",
      "name email phone profileImage professionalTitle location bio skills education experience resumeUrl portfolioUrl linkedinUrl"
    )
    .populate(
      "job",
      "title companyName location jobType workplaceType description requirements responsibilities deadline status createdBy"
    )
    .lean();

  if (!application) {
    res.status(404);
    throw new Error("Application was not found.");
  }

  const applicantId =
    application.applicant?._id?.toString() ||
    application.applicant?.toString();

  const jobOwnerId =
    application.job?.createdBy?.toString();

  const requesterId = req.user._id.toString();

  const canView =
    applicantId === requesterId ||
    jobOwnerId === requesterId ||
    req.user.role === "admin";

  if (!canView) {
    res.status(403);
    throw new Error(
      "You are not allowed to view this application."
    );
  }

  res.status(200).json({
    success: true,
    data: {
      application,
    },
  });
});

/**
 * @desc    Update application status
 * @route   PATCH /api/applications/:id/status
 * @access  Job owner/Admin
 */
export const updateApplicationStatus = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid application ID.");
    }

    const allowedStatuses = [
      "submitted",
      "under-review",
      "shortlisted",
      "interview-scheduled",
      "selected",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(
        "Invalid application status."
      );
    }

    const application = await Application.findById(id);

    if (!application) {
      res.status(404);
      throw new Error("Application was not found.");
    }

    const job = await Job.findById(application.job);

    if (!job) {
      res.status(404);
      throw new Error("Related job was not found.");
    }

    const isOwner =
      job.createdBy.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      res.status(403);
      throw new Error(
        "You are not allowed to update this application."
      );
    }

    application.status = status;

    if (status === "interview-scheduled") {
      const {
        interviewDate,
        interviewLocation,
        interviewNotes,
      } = req.body;

      if (!interviewDate) {
        res.status(400);
        throw new Error(
          "Interview date is required for interview-scheduled status."
        );
      }

      const parsedInterviewDate = new Date(interviewDate);

      if (Number.isNaN(parsedInterviewDate.getTime())) {
        res.status(400);
        throw new Error("Invalid interview date.");
      }

      if (parsedInterviewDate <= new Date()) {
        res.status(400);
        throw new Error("Interview date must be in the future.");
      }

      application.interviewDate = parsedInterviewDate;
      application.interviewLocation =
        interviewLocation?.trim() || "";
      application.interviewNotes =
        interviewNotes?.trim() || "";
    }

    if (status !== "interview-scheduled") {
      application.interviewDate = undefined;
      application.interviewLocation = undefined;
      application.interviewNotes = undefined;
    }

    await application.save();

    const updatedApplication = await Application.findById(
      application._id
    )
      .populate(
        "applicant",
        "name email phone profileImage professionalTitle"
      )
      .populate(
        "job",
        "title companyName location jobType deadline status"
      )
      .lean();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      data: {
        application: updatedApplication,
      },
    });
  }
);

/**
 * @desc    Withdraw an application
 * @route   DELETE /api/applications/:id
 * @access  Candidate applicant
 */
export const withdrawApplication = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid application ID.");
    }

    if (req.user.role !== "candidate") {
      res.status(403);
      throw new Error(
        "Only candidates can withdraw applications."
      );
    }

    const application = await Application.findById(id);

    if (!application) {
      res.status(404);
      throw new Error("Application was not found.");
    }

    if (
      application.applicant.toString() !==
      req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "You are not allowed to withdraw this application."
      );
    }

    const nonWithdrawableStatuses = [
      "selected",
      "rejected",
    ];

    if (
      nonWithdrawableStatuses.includes(application.status)
    ) {
      res.status(400);
      throw new Error(
        `An application with status "${application.status}" cannot be withdrawn.`
      );
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
    });
  }
);