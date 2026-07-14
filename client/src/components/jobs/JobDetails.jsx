import {
    BriefcaseBusiness,
    Building2,
    GraduationCap,
    ListChecks,
    MapPin,
    Users,
} from "lucide-react";

export default function JobDetails({ job }) {
  const responsibilities = Array.isArray(job?.responsibilities)
    ? job.responsibilities
    : [];

  const requirements = Array.isArray(job?.requirements)
    ? job.requirements
    : [];

  const skills = Array.isArray(job?.skills) ? job.skills : [];

  return (
    <article className="space-y-8">
      <Section title="Job Description">
        <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
          {job?.description || "No job description provided."}
        </p>
      </Section>

      {responsibilities.length > 0 ? (
        <Section title="Responsibilities" icon={ListChecks}>
          <BulletList items={responsibilities} />
        </Section>
      ) : null}

      {requirements.length > 0 ? (
        <Section title="Requirements" icon={BriefcaseBusiness}>
          <BulletList items={requirements} />
        </Section>
      ) : null}

      {skills.length > 0 ? (
        <Section title="Required Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Additional Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={Building2}
            label="Company"
            value={job?.companyName}
          />

          <InfoCard
            icon={MapPin}
            label="Location"
            value={job?.location}
          />

          <InfoCard
            icon={BriefcaseBusiness}
            label="Experience Level"
            value={formatLabel(job?.experienceLevel)}
          />

          <InfoCard
            icon={GraduationCap}
            label="Education"
            value={job?.educationLevel || "Not specified"}
          />

          <InfoCard
            icon={Users}
            label="Vacancies"
            value={job?.vacancies || 1}
          />
        </div>
      </Section>
    </article>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Icon size={20} />
          </div>
        ) : null}

        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-3 text-sm leading-6 text-slate-600"
        >
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
      <Icon size={19} className="mt-0.5 shrink-0 text-blue-700" />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-900">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

function formatLabel(value) {
  if (!value) {
    return "Not specified";
  }

  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}