export const APP_NAME = "JobPortal";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export const USER_ROLES = {
  CANDIDATE: "candidate",
  EMPLOYER: "employer",
  ADMIN: "admin",
};

export const JOB_STATUSES = {
  DRAFT: "draft",
  ACTIVE: "active",
  CLOSED: "closed",
};

export const JOB_TYPES = [
  {
    label: "Full-time",
    value: "full-time",
  },
  {
    label: "Part-time",
    value: "part-time",
  },
  {
    label: "Contract",
    value: "contract",
  },
  {
    label: "Internship",
    value: "internship",
  },
  {
    label: "Temporary",
    value: "temporary",
  },
  {
    label: "Freelance",
    value: "freelance",
  },
];

export const WORKPLACE_TYPES = [
  {
    label: "On-site",
    value: "on-site",
  },
  {
    label: "Remote",
    value: "remote",
  },
  {
    label: "Hybrid",
    value: "hybrid",
  },
];

export const EXPERIENCE_LEVELS = [
  {
    label: "Entry Level",
    value: "entry-level",
  },
  {
    label: "Junior",
    value: "junior",
  },
  {
    label: "Mid Level",
    value: "mid-level",
  },
  {
    label: "Senior",
    value: "senior",
  },
  {
    label: "Lead",
    value: "lead",
  },
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "Director",
    value: "director",
  },
];

export const APPLICATION_STATUSES = [
  {
    label: "Submitted",
    value: "submitted",
  },
  {
    label: "Under Review",
    value: "under-review",
  },
  {
    label: "Shortlisted",
    value: "shortlisted",
  },
  {
    label: "Interview Scheduled",
    value: "interview-scheduled",
  },
  {
    label: "Selected",
    value: "selected",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

export const CONTACT_STATUSES = [
  {
    label: "New",
    value: "new",
  },
  {
    label: "Read",
    value: "read",
  },
  {
    label: "Replied",
    value: "replied",
  },
  {
    label: "Closed",
    value: "closed",
  },
];

export const STORAGE_KEYS = {
  TOKEN: "jobPortalToken",
  USER: "jobPortalUser",
};