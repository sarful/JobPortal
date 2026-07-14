import { useEffect, useState } from "react";

import { getAdminStatistics } from "../../api/adminApi";
import AdminStats from "../../components/admin/AdminStats";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

export default function AdminDashboardPage() {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminStatistics();

      setStatistics(response?.data || {});
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load admin statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  if (loading) {
    return (
      <Loader label="Loading admin dashboard..." />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadStatistics}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Monitor users, jobs, applications, and contact messages."
      />

      <AdminStats
        totalUsers={statistics.totalUsers}
        totalJobs={statistics.totalJobs}
        totalApplications={
          statistics.totalApplications
        }
        totalMessages={statistics.totalMessages}
      />
    </div>
  );
}