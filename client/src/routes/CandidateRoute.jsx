import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function CandidateRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user || user.role !== "candidate") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}