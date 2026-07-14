import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is currently nothing to display.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon size={26} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}