import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createJob } from "../../api/jobApi";
import PageHeader from "../../components/common/PageHeader";
import JobForm from "../../components/employer/JobForm";

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitJob = async (payload) => {
    try {
      setLoading(true);

      const response = await createJob(payload);

      toast.success(
        response.message || "Job created successfully."
      );

      navigate("/employer/jobs");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Job Post"
        description="Publish a new job opportunity for candidates."
      />

      <JobForm
        onSubmit={submitJob}
        submitLabel="Create Job"
        loading={loading}
      />
    </div>
  );
}