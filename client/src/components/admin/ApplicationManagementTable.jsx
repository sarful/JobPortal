import { Eye } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

export default function ApplicationManagementTable({
  applications = [],
  onView,
  onStatusChange,
}) {
  if (!applications.length) {
    return (
      <EmptyState
        title="No applications found"
        description="Submitted job applications will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Candidate",
              "Job",
              "Applied",
              "Status",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {applications.map((application) => {
            const id = application._id || application.id;

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {application.applicant?.name || "Unknown"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {application.applicant?.email || ""}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">
                    {application.job?.title || "Unavailable Job"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {application.job?.companyName || ""}
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
                    <option value="under-review">Under Review</option>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView?.(application)}
                  >
                    <Eye size={15} />
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}