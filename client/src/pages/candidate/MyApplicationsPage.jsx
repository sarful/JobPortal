import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getMyApplications,
    withdrawApplication,
} from "../../api/applicationApi";

import ApplicationTable from "../../components/candidate/ApplicationTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import Select from "../../components/common/Select";

const statusOptions = [
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "under-review" },
  { label: "Shortlisted", value: "shortlisted" },
  {
    label: "Interview Scheduled",
    value: "interview-scheduled",
  },
  { label: "Selected", value: "selected" },
  { label: "Rejected", value: "rejected" },
];

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyApplications({
        page,
        limit: 10,
        ...(status ? { status } : {}),
      });

      setApplications(
        response?.data?.applications || []
      );

      setPagination(
        response?.data?.pagination || {
          page: 1,
          totalPages: 1,
        }
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
  }, [page, status]);

  const confirmWithdraw = async () => {
    if (!selectedApplication) {
      return;
    }

    try {
      setWithdrawing(true);

      const id =
        selectedApplication._id || selectedApplication.id;

      const response = await withdrawApplication(id);

      toast.success(
        response.message || "Application withdrawn."
      );

      setSelectedApplication(null);
      loadApplications();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to withdraw application."
      );
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="View and track all jobs you have applied for."
        actions={
          <div className="w-56">
            <Select
              value={status}
              options={statusOptions}
              placeholder="All statuses"
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            />
          </div>
        }
      />

      {loading ? (
        <Loader label="Loading applications..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={loadApplications}
        />
      ) : (
        <>
          <ApplicationTable
            applications={applications}
            onWithdraw={setSelectedApplication}
          />

          <div className="mt-8">
            <Pagination
              currentPage={pagination.page || page}
              totalPages={pagination.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        onConfirm={confirmWithdraw}
        loading={withdrawing}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmText="Withdraw"
      />
    </div>
  );
}