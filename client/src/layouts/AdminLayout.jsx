import {
    BriefcaseBusiness,
    FileText,
    FolderKanban,
    LayoutDashboard,
    Mail,
    UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardTopbar from "../components/layout/DashboardTopbar";
import MobileMenu from "../components/layout/MobileMenu";
import { useAuthStore } from "../store/authStore";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: UsersRound,
  },
  {
    label: "Jobs",
    path: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: FileText,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: FolderKanban,
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: Mail,
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        items={navigationItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
        onLogout={handleLogout}
      />

      <div className="min-w-0 flex-1">
        <DashboardTopbar
          title="Admin Dashboard"
          onOpenSidebar={() => setMobileOpen(true)}
        />

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        dashboardPath="/admin/dashboard"
        onLogout={handleLogout}
      />
    </div>
  );
}