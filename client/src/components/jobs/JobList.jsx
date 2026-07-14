import { BriefcaseBusiness } from "lucide-react";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";
import JobCard from "./JobCard";

export default function JobList({
  jobs = [],
  loading = false,
  error = "",
  onRetry,
}) {
  if (loading) {
    return <Loader label="Loading jobs..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!jobs.length) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="No jobs found"
        description="Try changing your search terms or filters."
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job._id || job.id} job={job} />
      ))}
    </div>
  );
}