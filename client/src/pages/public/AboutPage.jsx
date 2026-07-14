import {
    BriefcaseBusiness,
    Building2,
    SearchCheck,
    ShieldCheck,
    UsersRound,
} from "lucide-react";

const values = [
  {
    icon: SearchCheck,
    title: "Simple Job Discovery",
    description:
      "Candidates can search and filter relevant opportunities without unnecessary complexity.",
  },
  {
    icon: Building2,
    title: "Efficient Recruitment",
    description:
      "Employers can publish vacancies, review applicants, and manage hiring activities.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Authentication, authorization, and ownership checks protect private information.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-blue-200">
            <BriefcaseBusiness size={17} />
            About JobPortal
          </span>

          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
            Connecting talent with meaningful opportunities
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            JobPortal helps candidates discover jobs and enables
            employers to manage recruitment from one responsive,
            organized platform.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Our mission
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Make recruitment clear, accessible, and efficient
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Our mission is to give candidates an easier way to find,
              evaluate, and apply for opportunities while giving
              employers practical tools to manage job posts and
              applicants.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Our vision
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              A trusted digital employment ecosystem
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              We aim to build a reliable employment platform where
              skills, experience, and organizational needs connect
              through a transparent hiring process.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
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

      <section className="bg-blue-700 py-16 text-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 text-center sm:grid-cols-3 sm:px-6">
          <Statistic icon={BriefcaseBusiness} value="2,500+" label="Jobs" />
          <Statistic icon={Building2} value="850+" label="Companies" />
          <Statistic icon={UsersRound} value="18,000+" label="Candidates" />
        </div>
      </section>
    </>
  );
}

function Statistic({ icon: Icon, value, label }) {
  return (
    <div>
      <Icon className="mx-auto" size={28} />
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-blue-100">{label}</p>
    </div>
  );
}