import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import CandidateLayout from "../layouts/CandidateLayout";
import EmployerLayout from "../layouts/EmployerLayout";
import MainLayout from "../layouts/MainLayout";

import AdminRoute from "./AdminRoute";
import CandidateRoute from "./CandidateRoute";
import EmployerRoute from "./EmployerRoute";
import ProtectedRoute from "./ProtectedRoute";

import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import HomePage from "../pages/public/HomePage";
import JobDetailsPage from "../pages/public/JobDetailsPage";
import JobsPage from "../pages/public/JobsPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import ApplicationDetailsPage from "../pages/candidate/ApplicationDetailsPage";
import CandidateDashboardPage from "../pages/candidate/CandidateDashboardPage";
import CandidateProfilePage from "../pages/candidate/CandidateProfilePage";
import MyApplicationsPage from "../pages/candidate/MyApplicationsPage";

import ApplicantDetailsPage from "../pages/employer/ApplicantDetailsPage";
import CompanyProfilePage from "../pages/employer/CompanyProfilePage";
import CreateJobPage from "../pages/employer/CreateJobPage";
import EditJobPage from "../pages/employer/EditJobPage";
import EmployerDashboardPage from "../pages/employer/EmployerDashboardPage";
import JobApplicantsPage from "../pages/employer/JobApplicantsPage";
import MyJobsPage from "../pages/employer/MyJobsPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ManageApplicationsPage from "../pages/admin/ManageApplicationsPage";
import ManageCategoriesPage from "../pages/admin/ManageCategoriesPage";
import ManageJobsPage from "../pages/admin/ManageJobsPage";
import ManageMessagesPage from "../pages/admin/ManageMessagesPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />

        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route
          path="unauthorized"
          element={<UnauthorizedPage />}
        />

        <Route path="404" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<CandidateRoute />}>
          <Route
            path="/candidate"
            element={<CandidateLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="/candidate/dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<CandidateDashboardPage />}
            />

            <Route
              path="profile"
              element={<CandidateProfilePage />}
            />

            <Route
              path="applications"
              element={<MyApplicationsPage />}
            />

            <Route
              path="applications/:id"
              element={<ApplicationDetailsPage />}
            />
          </Route>
        </Route>

        <Route element={<EmployerRoute />}>
          <Route
            path="/employer"
            element={<EmployerLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="/employer/dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<EmployerDashboardPage />}
            />

            <Route
              path="profile"
              element={<CompanyProfilePage />}
            />

            <Route
              path="jobs"
              element={<MyJobsPage />}
            />

            <Route
              path="jobs/create"
              element={<CreateJobPage />}
            />

            <Route
              path="jobs/:id/edit"
              element={<EditJobPage />}
            />

            <Route
              path="jobs/:id/applicants"
              element={<JobApplicantsPage />}
            />

            <Route
              path="applications/:id"
              element={<ApplicantDetailsPage />}
            />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<AdminDashboardPage />}
            />

            <Route
              path="users"
              element={<ManageUsersPage />}
            />

            <Route
              path="jobs"
              element={<ManageJobsPage />}
            />

            <Route
              path="applications"
              element={<ManageApplicationsPage />}
            />

            <Route
              path="categories"
              element={<ManageCategoriesPage />}
            />

            <Route
              path="messages"
              element={<ManageMessagesPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}