import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function EmployerRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== "employer") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}