import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getJobById,
    updateJob,
} from "../../api/jobApi";

import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import JobForm from "../../components/employer/JobForm";

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadJob = async () => {
    try {
      setLoadingJob(true);
      setError("");

      const response = await getJobById(id);
      setJob(response?.data?.job || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load job."
      );
    } finally {
      setLoadingJob(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const submitJob = async (payload) => {
    try {
      setSaving(true);

      const response = await updateJob(id, payload);

      toast.success(
        response.message || "Job updated successfully."
      );

      navigate("/employer/jobs");
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingJob) {
    return <Loader label="Loading job..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadJob} />;
  }

  return (
    <div>
      <PageHeader
        title="Edit Job"
        description="Update job information, requirements, salary, and deadline."
      />

      <JobForm
        initialData={job}
        onSubmit={submitJob}
        submitLabel="Update Job"
        loading={saving}
      />
    </div>
  );
}