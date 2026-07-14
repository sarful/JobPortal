import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAdminJobs } from "../../api/adminApi";
import {
    deleteJob,
    updateJobStatus,
} from "../../api/jobApi";

import JobManagementTable from "../../components/admin/JobManagementTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminJobs({
        page: 1,
        limit: 100,
      });

      setJobs(response?.data?.jobs || []);
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
  }, []);

  const changeStatus = async (job, status) => {
    try {
      await updateJobStatus(job._id || job.id, status);

      toast.success("Job status updated.");
      loadJobs();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update job."
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
        title="Manage Jobs"
        description="Review all job posts and control their status."
      />

      {loading ? (
        <Loader label="Loading jobs..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadJobs} />
      ) : (
        <JobManagementTable
          jobs={jobs}
          onStatusChange={changeStatus}
          onDelete={setSelectedJob}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Job"
        message="This will permanently delete the job and may delete related applications."
        confirmText="Delete Job"
      />
    </div>
  );
}