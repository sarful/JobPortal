import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

export default function JobManagementTable({
  jobs = [],
  onStatusChange,
  onDelete,
}) {
  if (!jobs.length) {
    return (
      <EmptyState
        title="No jobs found"
        description="Published job posts will appear here."
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
              "Employer",
              "Status",
              "Deadline",
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
          {jobs.map((job) => {
            const id = job._id || job.id;

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {job.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {job.companyName}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {job.createdBy?.name || "Unknown employer"}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={job.status}
                    onChange={(event) =>
                      onStatusChange?.(job, event.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>

                  <div className="mt-2">
                    <StatusBadge status={job.status} />
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDate(job.deadline)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link to={`/jobs/${id}`}>
                      <Button size="sm" variant="outline">
                        <Eye size={15} />
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete?.(job)}
                    >
                      <Trash2 size={15} />
                    </Button>
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