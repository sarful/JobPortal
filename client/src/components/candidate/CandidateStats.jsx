import {
    CheckCircle2,
    Clock3,
    FileText,
    SearchCheck,
    XCircle,
} from "lucide-react";

export default function CandidateStats({
  applications = [],
}) {
  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FileText,
    },
    {
      label: "Under Review",
      value: applications.filter((item) =>
        ["submitted", "under-review"].includes(item.status)
      ).length,
      icon: Clock3,
    },
    {
      label: "Shortlisted",
      value: applications.filter((item) =>
        ["shortlisted", "interview-scheduled"].includes(item.status)
      ).length,
      icon: SearchCheck,
    },
    {
      label: "Selected",
      value: applications.filter(
        (item) => item.status === "selected"
      ).length,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value: applications.filter(
        (item) => item.status === "rejected"
      ).length,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map(({ label, value, icon: Icon }) => (
        <article
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">{label}</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {value}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Icon size={21} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}