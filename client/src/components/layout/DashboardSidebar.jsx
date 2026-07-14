import {
    BriefcaseBusiness,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItemClasses = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-blue-700 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

export default function DashboardSidebar({
  items = [],
  collapsed = false,
  onToggle,
  onLogout,
}) {
  return (
    <aside
      className={[
        "hidden min-h-screen shrink-0 border-r border-slate-200 bg-white transition-all lg:flex lg:flex-col",
        collapsed ? "w-20" : "w-72",
      ].join(" ")}
    >
      <div className="flex h-18 items-center justify-between border-b border-slate-200 px-4">
        <NavLink
          to="/"
          className="flex min-w-0 items-center gap-3 font-bold text-slate-900"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
            <BriefcaseBusiness size={20} />
          </span>

          {!collapsed ? (
            <span className="truncate text-lg">
              Job<span className="text-blue-700">Portal</span>
            </span>
          ) : null}
        </NavLink>

        {!collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={19} />
          </button>
        ) : null}
      </div>

      {collapsed ? (
        <button
          type="button"
          onClick={onToggle}
          className="mx-auto mt-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={19} />
        </button>
      ) : null}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(({ label, path, icon: Icon, end = false }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={navItemClasses}
            title={collapsed ? label : undefined}
          >
            {Icon ? <Icon size={19} className="shrink-0" /> : null}

            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className={[
            "flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50",
            collapsed ? "justify-center" : "gap-3",
          ].join(" ")}
        >
          <LogOut size={19} />

          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  );
}