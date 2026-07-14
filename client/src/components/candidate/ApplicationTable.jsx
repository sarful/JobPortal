import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

export default function ApplicationTable({
  applications = [],
  onWithdraw,
}) {
  if (!applications.length) {
    return (
      <EmptyState
        title="No applications found"
        description="Applications you submit will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Job",
              "Company",
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
            const job = application.job || {};
            const id = application._id || application.id;

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-semibold text-slate-900">
                  {job.title || "Unavailable Job"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {job.companyName || "Unknown"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDate(
                    application.appliedAt ||
                      application.createdAt
                  )}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={application.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link to={`/candidate/applications/${id}`}>
                      <Button size="sm" variant="outline">
                        <Eye size={15} />
                      </Button>
                    </Link>

                    {!["selected", "rejected"].includes(
                      application.status
                    ) ? (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onWithdraw?.(application)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}