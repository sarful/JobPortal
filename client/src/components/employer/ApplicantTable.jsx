import { ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

export default function ApplicantTable({
  applications = [],
  onStatusChange,
}) {
  if (!applications.length) {
    return (
      <EmptyState
        title="No applicants found"
        description="Applications submitted for this job will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Applicant",
              "Applied",
              "Status",
              "Resume",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {applications.map((application) => {
            const applicant = application.applicant || {};
            const id = application._id || application.id;

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {applicant.name || "Unknown"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {applicant.email || "No email"}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDate(
                    application.appliedAt ||
                      application.createdAt
                  )}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={application.status}
                    onChange={(event) =>
                      onStatusChange?.(
                        application,
                        event.target.value
                      )
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under-review">
                      Under Review
                    </option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview-scheduled">
                      Interview Scheduled
                    </option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <div className="mt-2">
                    <StatusBadge status={application.status} />
                  </div>
                </td>

                <td className="px-5 py-4">
                  {application.resumeUrl ? (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
                    >
                      <ExternalLink size={15} />
                      Open
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400">
                      Not available
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <Link to={`/employer/applications/${id}`}>
                    <Button size="sm" variant="outline">
                      <Eye size={15} />
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}