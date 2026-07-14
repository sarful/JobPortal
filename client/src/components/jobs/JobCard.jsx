import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    MapPin,
    WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import StatusBadge from "../common/StatusBadge";

export default function JobCard({ job }) {
  const jobId = job?._id || job?.id;

  const salary =
    job?.salaryMin !== null &&
    job?.salaryMin !== undefined &&
    job?.salaryMax !== null &&
    job?.salaryMax !== undefined
      ? `${formatCurrency(
          job.salaryMin,
          job.salaryCurrency
        )} - ${formatCurrency(job.salaryMax, job.salaryCurrency)}`
      : "Negotiable";

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {job?.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Building2 size={25} />
            </div>
          )}

          <div className="min-w-0">
            <Link
              to={`/jobs/${jobId}`}
              className="line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-blue-700"
            >
              {job?.title || "Untitled Job"}
            </Link>

            <p className="mt-1 truncate text-sm text-slate-500">
              {job?.companyName || "Unknown Company"}
            </p>
          </div>
        </div>

        <StatusBadge status={job?.status || "active"} />
      </div>

      <div className="mt-6 grid gap-3 text-sm text-slate-600">
        <JobMeta
          icon={MapPin}
          text={job?.location || "Location not specified"}
        />

        <JobMeta
          icon={BriefcaseBusiness}
          text={formatLabel(job?.jobType)}
        />

        <JobMeta
          icon={WalletCards}
          text={salary}
        />

        <JobMeta
          icon={CalendarDays}
          text={
            job?.deadline
              ? `Apply before ${formatDate(job.deadline)}`
              : "Deadline not specified"
          }
        />
      </div>

      {Array.isArray(job?.skills) && job.skills.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto pt-6">
        <Link
          to={`/jobs/${jobId}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function JobMeta({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={17} className="shrink-0 text-slate-400" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function formatLabel(value) {
  if (!value) {
    return "Not specified";
  }

  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}