import { Bell, Menu, Search, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function DashboardTopbar({
  title = "Dashboard",
  onOpenSidebar,
}) {
  const [search, setSearch] = useState("");

  const user = useAuthStore((state) => state.user);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    console.log("Dashboard search:", search.trim());
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-18 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open dashboard navigation"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
            {title}
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your Job Portal account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="ml-auto hidden w-full max-w-sm md:block"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dashboard..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </form>

        <button
          type="button"
          className="relative rounded-lg p-2.5 text-slate-600 hover:bg-slate-100"
          aria-label="View notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
              {user?.name || "User"}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {user?.role || "Account"}
            </p>
          </div>

          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UserRound size={20} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}