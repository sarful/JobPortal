import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyJobs } from "../../api/jobApi";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import EmployerJobTable from "../../components/employer/EmployerJobTable";
import EmployerStats from "../../components/employer/EmployerStats";

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [totalApplications, setTotalApplications] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyJobs({
        page: 1,
        limit: 5,
      });

      const result = response?.data?.jobs || [];

      setJobs(result);

      setTotalApplications(
        result.reduce(
          (total, job) =>
            total + Number(job.applicationCount || 0),
          0
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load employer dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <Loader label="Loading employer dashboard..." />;
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
        title="Employer Dashboard"
        description="Manage your job posts and monitor received applications."
        actions={
          <Link to="/employer/jobs/create">
            <Button>
              <PlusCircle size={17} />
              Post a Job
            </Button>
          </Link>
        }
      />

      <EmployerStats
        jobs={jobs}
        totalApplications={totalApplications}
      />

      <section>
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Recent Job Posts
        </h2>

        <EmployerJobTable jobs={jobs} />
      </section>
    </div>
  );
}