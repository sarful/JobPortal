import {
    BadgeCheck,
    BellRing,
    FileCheck2,
    SearchCheck,
    ShieldCheck,
    UsersRound,
} from "lucide-react";

const features = [
  {
    icon: SearchCheck,
    title: "Easy job discovery",
    description:
      "Search and filter opportunities by title, category, location, workplace type, and experience level.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted employers",
    description:
      "Connect with genuine organizations publishing clear and relevant job opportunities.",
  },
  {
    icon: FileCheck2,
    title: "Simple applications",
    description:
      "Submit applications online, attach your resume, and manage every application in one place.",
  },
  {
    icon: BellRing,
    title: "Status tracking",
    description:
      "Follow each application's progress from submission through review, interview, and final decision.",
  },
  {
    icon: UsersRound,
    title: "Candidate profiles",
    description:
      "Present your skills, education, professional experience, portfolio, and resume to employers.",
  },
  {
    icon: BadgeCheck,
    title: "Employer tools",
    description:
      "Post jobs, manage listings, review applicants, and update hiring statuses through a dedicated dashboard.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Why choose us
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            A better experience for candidates and employers
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            JobPortal combines job discovery, recruitment management, and
            application tracking in a clean and secure platform.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
            <p className="text-sm font-medium text-blue-300">
              Built for efficient recruitment
            </p>

            <p className="mt-3 text-2xl font-bold">
              One platform for the complete hiring journey
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              From publishing a vacancy to selecting the right candidate,
              every important step remains organized and accessible.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Icon size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}