import {
    BriefcaseBusiness,
    FileText,
    Mail,
    UsersRound,
} from "lucide-react";

export default function AdminStats({
  totalUsers = 0,
  totalJobs = 0,
  totalApplications = 0,
  totalMessages = 0,
}) {
  const statistics = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: UsersRound,
    },
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      value: totalApplications,
      icon: FileText,
    },
    {
      label: "Contact Messages",
      value: totalMessages,
      icon: Mail,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {statistics.map(({ label, value, icon: Icon }) => (
        <article
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{label}</p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {Number(value).toLocaleString()}
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