import { LogOut, UserRound, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const navLinkClasses = ({ isActive }) =>
  [
    "block rounded-lg px-4 py-3 text-sm font-medium transition",
    isActive
      ? "bg-blue-50 text-blue-700"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ");

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  dashboardPath,
  onLogout,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Close navigation overlay"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <p className="text-lg font-bold text-slate-900">
            Navigation
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <NavLink to="/" end onClick={onClose} className={navLinkClasses}>
            Home
          </NavLink>

          <NavLink to="/jobs" onClick={onClose} className={navLinkClasses}>
            Jobs
          </NavLink>

          <NavLink to="/about" onClick={onClose} className={navLinkClasses}>
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            onClick={onClose}
            className={navLinkClasses}
          >
            Contact
          </NavLink>

          {user ? (
            <>
              <div className="my-4 border-t border-slate-200" />

              <NavLink
                to={dashboardPath}
                onClick={onClose}
                className={navLinkClasses}
              >
                Dashboard
              </NavLink>

              {user.role === "candidate" ? (
                <>
                  <NavLink
                    to="/candidate/applications"
                    onClick={onClose}
                    className={navLinkClasses}
                  >
                    My Applications
                  </NavLink>

                  <NavLink
                    to="/candidate/profile"
                    onClick={onClose}
                    className={navLinkClasses}
                  >
                    Profile
                  </NavLink>
                </>
              ) : null}

              {user.role === "employer" ? (
                <>
                  <NavLink
                    to="/employer/jobs"
                    onClick={onClose}
                    className={navLinkClasses}
                  >
                    My Jobs
                  </NavLink>

                  <NavLink
                    to="/employer/jobs/create"
                    onClick={onClose}
                    className={navLinkClasses}
                  >
                    Post a Job
                  </NavLink>
                </>
              ) : null}
            </>
          ) : null}
        </nav>

        <div className="border-t border-slate-200 p-4">
          {user ? (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <UserRound size={20} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>

                  <p className="truncate text-xs capitalize text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <NavLink
                to="/login"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={onClose}
                className="rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}