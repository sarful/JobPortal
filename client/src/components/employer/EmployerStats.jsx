import {
    BriefcaseBusiness,
    FileText,
    LockKeyhole,
    UsersRound,
} from "lucide-react";

export default function EmployerStats({
  jobs = [],
  totalApplications = 0,
}) {
  const stats = [
    {
      label: "Total Jobs",
      value: jobs.length,
      icon: BriefcaseBusiness,
    },
    {
      label: "Active Jobs",
      value: jobs.filter((job) => job.status === "active").length,
      icon: FileText,
    },
    {
      label: "Closed Jobs",
      value: jobs.filter((job) => job.status === "closed").length,
      icon: LockKeyhole,
    },
    {
      label: "Applications",
      value: totalApplications,
      icon: UsersRound,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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