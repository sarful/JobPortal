const statusStyles = {
  active: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-200 text-slate-700",
  draft: "bg-amber-100 text-amber-700",

  submitted: "bg-blue-100 text-blue-700",
  "under-review": "bg-violet-100 text-violet-700",
  shortlisted: "bg-cyan-100 text-cyan-700",
  "interview-scheduled": "bg-indigo-100 text-indigo-700",
  selected: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",

  new: "bg-blue-100 text-blue-700",
  read: "bg-slate-200 text-slate-700",
  replied: "bg-emerald-100 text-emerald-700",

  candidate: "bg-cyan-100 text-cyan-700",
  employer: "bg-violet-100 text-violet-700",
  admin: "bg-red-100 text-red-700",
};

const formatStatus = (status) =>
  String(status || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export default function StatusBadge({
  status,
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        statusStyles[status] ||
          "bg-slate-100 text-slate-700",
        className,
      ].join(" ")}
    >
      {formatStatus(status)}
    </span>
  );
}