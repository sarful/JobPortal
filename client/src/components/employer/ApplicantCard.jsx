import {
    ExternalLink,
    Mail,
    MapPin,
    UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";

export default function ApplicantCard({
  application,
  onStatusChange,
}) {
  const applicant = application?.applicant || {};
  const id = application?._id || application?.id;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {applicant.profileImage ? (
          <img
            src={applicant.profileImage}
            alt={applicant.name}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <UserRound size={24} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">
            {applicant.name || "Unknown Applicant"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {applicant.professionalTitle || "Candidate"}
          </p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Mail size={16} />
          {applicant.email || "Not available"}
        </p>

        <p className="flex items-center gap-2">
          <MapPin size={16} />
          {applicant.location || "Not specified"}
        </p>
      </div>

      <div className="mt-5">
        <select
          value={application.status}
          onChange={(event) =>
            onStatusChange?.(application, event.target.value)
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
        >
          <option value="submitted">Submitted</option>
          <option value="under-review">Under Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview-scheduled">
            Interview Scheduled
          </option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-5 flex gap-3">
        <Link to={`/employer/applications/${id}`}>
          <Button variant="outline">
            View Application
          </Button>
        </Link>

        {application.resumeUrl ? (
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Button>
              <ExternalLink size={16} />
              Resume
            </Button>
          </a>
        ) : null}
      </div>
    </article>
  );
}