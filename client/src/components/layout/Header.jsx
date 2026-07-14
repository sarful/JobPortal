import { BriefcaseBusiness, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import MobileMenu from "./MobileMenu";

const navLinkClasses = ({ isActive }) =>
  [
    "text-sm font-medium transition",
    isActive
      ? "text-blue-700"
      : "text-slate-600 hover:text-slate-900",
  ].join(" ");

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const getDashboardPath = () => {
    if (!user) {
      return "/login";
    }

    if (user.role === "candidate") {
      return "/candidate/dashboard";
    }

    if (user.role === "employer") {
      return "/employer/dashboard";
    }

    return "/admin/dashboard";
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-slate-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
              <BriefcaseBusiness size={21} />
            </span>

            <span>
              Job<span className="text-blue-700">Portal</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <NavLink to="/" end className={navLinkClasses}>
              Home
            </NavLink>

            <NavLink to="/jobs" className={navLinkClasses}>
              Jobs
            </NavLink>

            <NavLink to="/about" className={navLinkClasses}>
              About Us
            </NavLink>

            <NavLink to="/contact" className={navLinkClasses}>
              Contact
            </NavLink>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <UserRound size={17} />
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        dashboardPath={getDashboardPath()}
        onLogout={handleLogout}
      />
    </>
  );
}