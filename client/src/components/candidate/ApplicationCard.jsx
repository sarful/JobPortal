import {
    Building2,
    CalendarDays,
    Eye,
    MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";

export default function ApplicationCard({
  application,
  onWithdraw,
}) {
  const job = application?.job || {};

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {job.title || "Unavailable Job"}
          </h3>

          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <Building2 size={15} />
            {job.companyName || "Unknown Company"}
          </p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin size={16} />
          {job.location || "Not specified"}
        </p>

        <p className="flex items-center gap-2">
          <CalendarDays size={16} />
          Applied on{" "}
          {formatDate(
            application.appliedAt || application.createdAt
          )}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/candidate/applications/${
            application._id || application.id
          }`}
        >
          <Button variant="outline">
            <Eye size={16} />
            View Details
          </Button>
        </Link>

        {!["selected", "rejected"].includes(application.status) ? (
          <Button
            variant="danger"
            onClick={() => onWithdraw?.(application)}
          >
            Withdraw
          </Button>
        ) : null}
      </div>
    </article>
  );
}