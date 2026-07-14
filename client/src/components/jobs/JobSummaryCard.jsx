import {
    BriefcaseBusiness,
    CalendarDays,
    Clock3,
    MapPin,
    WalletCards,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";

export default function JobSummaryCard({
  job,
  hasApplied = false,
  isOwner = false,
  isExpired = false,
  onApply,
}) {
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

  const cannotApply =
    hasApplied ||
    isOwner ||
    isExpired ||
    job?.status !== "active";

  const buttonText = hasApplied
    ? "Already Applied"
    : isOwner
      ? "Your Job Post"
      : isExpired
        ? "Application Closed"
        : job?.status !== "active"
          ? "Job Not Active"
          : "Apply Now";

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">
          Job Overview
        </h2>

        <StatusBadge status={job?.status || "active"} />
      </div>

      <div className="mt-6 space-y-4">
        <SummaryItem
          icon={BriefcaseBusiness}
          label="Job Type"
          value={formatLabel(job?.jobType)}
        />

        <SummaryItem
          icon={MapPin}
          label="Location"
          value={job?.location || "Not specified"}
        />

        <SummaryItem
          icon={WalletCards}
          label="Salary"
          value={salary}
        />

        <SummaryItem
          icon={Clock3}
          label="Workplace"
          value={formatLabel(job?.workplaceType)}
        />

        <SummaryItem
          icon={CalendarDays}
          label="Deadline"
          value={
            job?.deadline
              ? formatDate(job.deadline)
              : "Not specified"
          }
        />
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-7 w-full"
        disabled={cannotApply}
        onClick={onApply}
      >
        {buttonText}
      </Button>

      {!cannotApply ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          Submit your resume and application information.
        </p>
      ) : null}
    </aside>
  );
}

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-900">
          {value}
        </p>
      </div>
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