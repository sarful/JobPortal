import { BriefcaseBusiness } from "lucide-react";
import EmptyState from "../common/EmptyState";
import JobCard from "./JobCard";

export default function RelatedJobs({ jobs = [] }) {
  return (
    <section className="mt-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
          Similar opportunities
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Related Jobs
        </h2>
      </div>

      <div className="mt-6">
        {jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {jobs.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BriefcaseBusiness}
            title="No related jobs"
            description="There are currently no similar active jobs."
          />
        )}
      </div>
    </section>
  );
}