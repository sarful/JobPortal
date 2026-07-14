import {
    ExternalLink,
    Mail,
    MapPin,
    Phone,
    UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getApplicationById,
    updateApplicationStatus,
} from "../../api/applicationApi";

import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";

export default function ApplicantDetailsPage() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getApplicationById(id);
      setApplication(response?.data?.application || null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load application."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  const changeStatus = async (status) => {
    try {
      setUpdating(true);

      const payload = { status };

      if (status === "interview-scheduled") {
        const interviewDate = window.prompt(
          "Enter interview date and time, for example 2026-08-20T10:00"
        );

        if (!interviewDate) {
          return;
        }

        payload.interviewDate = interviewDate;
      }

      const response = await updateApplicationStatus(
        id,
        payload
      );

      setApplication(
        response?.data?.application || application
      );

      toast.success("Application status updated.");
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update status."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loader label="Loading applicant..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadApplication}
      />
    );
  }

  if (!application) {
    return null;
  }

  const applicant = application.applicant || {};

  return (
    <div>
      <PageHeader
        title="Applicant Details"
        description={`Application for ${application.job?.title || "job"}`}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {applicant.profileImage ? (
                <img
                  src={applicant.profileImage}
                  alt={applicant.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <UserRound size={38} />
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {applicant.name}
                </h2>

                <p className="mt-1 text-slate-500">
                  {applicant.professionalTitle || "Candidate"}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Mail size={16} />
                    {applicant.email}
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone size={16} />
                    {applicant.phone || "Not available"}
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {applicant.location || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Cover Letter
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {application.coverLetter ||
                "No cover letter was submitted."}
            </p>
          </article>

          {Array.isArray(applicant.skills) &&
          applicant.skills.length ? (
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Skills
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ) : null}
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-slate-900">
              Application Status
            </h2>

            <StatusBadge status={application.status} />
          </div>

          <select
            value={application.status}
            disabled={updating}
            onChange={(event) =>
              changeStatus(event.target.value)
            }
            className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          >
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview-scheduled">
              Interview Scheduled
            </option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
            {application.resumeUrl ? (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-full">
                  <ExternalLink size={17} />
                  View Resume
                </Button>
              </a>
            ) : null}

            {application.portfolioUrl ? (
              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink size={17} />
                  View Portfolio
                </Button>
              </a>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}