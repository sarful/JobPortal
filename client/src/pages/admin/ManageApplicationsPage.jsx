import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAdminApplications } from "../../api/adminApi";
import { updateApplicationStatus } from "../../api/applicationApi";

import ApplicationManagementTable from "../../components/admin/ApplicationManagementTable";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

export default function ManageApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminApplications({
        page: 1,
        limit: 100,
      });

      setApplications(
        response?.data?.applications || []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const changeStatus = async (application, status) => {
    try {
      const payload = { status };

      if (status === "interview-scheduled") {
        const interviewDate = window.prompt(
          "Enter interview date and time."
        );

        if (!interviewDate) {
          return;
        }

        payload.interviewDate = interviewDate;
      }

      await updateApplicationStatus(
        application._id || application.id,
        payload
      );

      toast.success("Application status updated.");
      loadApplications();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update application."
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Applications"
        description="Review applications submitted throughout the platform."
      />

      {loading ? (
        <Loader label="Loading applications..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={loadApplications}
        />
      ) : (
        <ApplicationManagementTable
          applications={applications}
          onStatusChange={changeStatus}
        />
      )}
    </div>
  );
}