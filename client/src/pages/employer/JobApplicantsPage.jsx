import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getJobApplications,
    updateApplicationStatus,
} from "../../api/applicationApi";

import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import ApplicantTable from "../../components/employer/ApplicantTable";

export default function JobApplicantsPage() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getJobApplications(id, {
        page,
        limit: 10,
      });

      setJob(response?.data?.job || null);
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
          "Unable to load applicants."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [id, page]);

  const changeStatus = async (application, status) => {
    try {
      const payload = { status };

      if (status === "interview-scheduled") {
        const interviewDate = window.prompt(
          "Enter interview date and time in ISO format, for example 2026-08-20T10:00"
        );

        if (!interviewDate) {
          return;
        }

        payload.interviewDate = interviewDate;
      }

      await updateApplicationStatus(
        application._id || application.id,
        payload
      );

      toast.success("Application status updated.");
      loadApplications();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update application."
      );
    }
  };

  return (
    <div>
      <PageHeader
        title={job?.title ? `${job.title} Applicants` : "Job Applicants"}
        description="Review candidates and update application statuses."
      />

      {loading ? (
        <Loader label="Loading applicants..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={loadApplications}
        />
      ) : (
        <>
          <ApplicantTable
            applications={applications}
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
    </div>
  );
}