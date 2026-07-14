import {
    BriefcaseBusiness,
    Building2,
    LayoutDashboard,
    PlusCircle,
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
    path: "/employer/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "My Jobs",
    path: "/employer/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Post a Job",
    path: "/employer/jobs/create",
    icon: PlusCircle,
  },
  {
    label: "Company Profile",
    path: "/employer/profile",
    icon: Building2,
  },
];

export default function EmployerLayout() {
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
          title="Employer Dashboard"
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
        dashboardPath="/employer/dashboard"
        onLogout={handleLogout}
      />
    </div>
  );
}