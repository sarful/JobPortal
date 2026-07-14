import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyApplications } from "../../api/applicationApi";
import { getLatestJobs } from "../../api/jobApi";

import ApplicationTable from "../../components/candidate/ApplicationTable";
import CandidateStats from "../../components/candidate/CandidateStats";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import JobCard from "../../components/jobs/JobCard";

export default function CandidateDashboardPage() {
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [applicationResponse, jobsResponse] = await Promise.all([
        getMyApplications({
          page: 1,
          limit: 5,
        }),
        getLatestJobs(3),
      ]);

      setApplications(
        applicationResponse?.data?.applications || []
      );

      setRecommendedJobs(jobsResponse?.data?.jobs || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load candidate dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <Loader label="Loading candidate dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadDashboard}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate Dashboard"
        description="Track your applications and discover recent job opportunities."
        actions={
          <Link to="/jobs">
            <Button>
              <BriefcaseBusiness size={17} />
              Browse Jobs
            </Button>
          </Link>
        }
      />

      <CandidateStats applications={applications} />

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest submitted job applications.
            </p>
          </div>

          <Link
            to="/candidate/applications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <ApplicationTable applications={applications} />
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Recent Job Opportunities
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Newly published jobs that may interest you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommendedJobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}