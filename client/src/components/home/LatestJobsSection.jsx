import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLatestJobs } from "../../api/jobApi";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";
import JobCard from "../jobs/JobCard";

export default function LatestJobsSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLatestJobs(6);

      setJobs(response?.data?.jobs || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load the latest jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Latest opportunities
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Recently posted jobs
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Explore newly published opportunities from companies looking
              for talented candidates.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            View all jobs
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-10">
          {loading ? <Loader label="Loading latest jobs..." /> : null}

          {!loading && error ? (
            <ErrorMessage message={error} onRetry={loadJobs} />
          ) : null}

          {!loading && !error && jobs.length === 0 ? (
            <EmptyState
              icon={BriefcaseBusiness}
              title="No active jobs available"
              description="New job opportunities will appear here when employers publish them."
              action={
                <Link
                  to="/jobs"
                  className="inline-flex rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Browse all jobs
                </Link>
              }
            />
          ) : null}

          {!loading && !error && jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}