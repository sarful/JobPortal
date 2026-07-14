import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getJobById } from "../../api/jobApi";
import { useAuthStore } from "../../store/authStore";

import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import ApplyJobModal from "../../components/jobs/ApplyJobModal";
import JobDetails from "../../components/jobs/JobDetails";
import JobSummaryCard from "../../components/jobs/JobSummaryCard";
import RelatedJobs from "../../components/jobs/RelatedJobs";

export default function JobDetailsPage() {
  const { id } = useParams();

  const user = useAuthStore((state) => state.user);

  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getJobById(id);
      const data = response?.data || {};

      setJob(data.job || null);
      setRelatedJobs(data.relatedJobs || []);
      setHasApplied(Boolean(data.hasApplied));
      setIsOwner(Boolean(data.isOwner));
      setIsExpired(Boolean(data.isExpired));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const handleApply = () => {
    if (!user) {
      toast.info("Please log in as a candidate to apply.");
      return;
    }

    if (user.role !== "candidate") {
      toast.error("Only candidate accounts can apply for jobs.");
      return;
    }

    setApplyOpen(true);
  };

  if (loading) {
    return <Loader fullScreen label="Loading job details..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <ErrorMessage message={error} onRetry={loadJob} />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={job.status} />
              <StatusBadge status={job.jobType} />
              <StatusBadge status={job.workplaceType} />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-950 sm:text-4xl">
              {job.title}
            </h1>

            <p className="mt-3 text-lg text-slate-600">
              {job.companyName} · {job.location}
            </p>
          </div>

          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="h-20 w-20 rounded-2xl border border-slate-200 object-cover"
            />
          ) : null}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <JobDetails job={job} />

        <JobSummaryCard
          job={job}
          hasApplied={hasApplied}
          isOwner={isOwner}
          isExpired={isExpired}
          onApply={handleApply}
        />
      </div>

      <RelatedJobs jobs={relatedJobs} />

      <ApplyJobModal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={job}
        onApplied={() => setHasApplied(true)}
      />
    </div>
  );
}