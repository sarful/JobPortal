import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
    deleteJob,
    getMyJobs,
    updateJobStatus,
} from "../../api/jobApi";

import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import EmployerJobTable from "../../components/employer/EmployerJobTable";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyJobs({
        page,
        limit: 10,
      });

      setJobs(response?.data?.jobs || []);
      setPagination(
        response?.data?.pagination || {
          page: 1,
          totalPages: 1,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page]);

  const changeStatus = async (job, status) => {
    try {
      await updateJobStatus(job._id || job.id, status);

      toast.success("Job status updated.");
      loadJobs();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update job status."
      );
    }
  };

  const confirmDelete = async () => {
    if (!selectedJob) {
      return;
    }

    try {
      setDeleting(true);

      await deleteJob(selectedJob._id || selectedJob.id);

      toast.success("Job deleted successfully.");
      setSelectedJob(null);
      loadJobs();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to delete job."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Job Posts"
        description="Create, edit, close, and manage your job listings."
        actions={
          <Link to="/employer/jobs/create">
            <Button>
              <PlusCircle size={17} />
              Create Job
            </Button>
          </Link>
        }
      />

      {loading ? (
        <Loader label="Loading jobs..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadJobs} />
      ) : (
        <>
          <EmployerJobTable
            jobs={jobs}
            onDelete={setSelectedJob}
            onStatusChange={changeStatus}
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
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Job"
        message="Are you sure you want to delete this job? Jobs with applications may need to be closed instead."
        confirmText="Delete Job"
      />
    </div>
  );
}