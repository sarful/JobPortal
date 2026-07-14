import { BriefcaseBusiness, UserRound } from "lucide-react";

const roles = [
  {
    value: "candidate",
    title: "Candidate",
    description: "Browse jobs and submit applications.",
    icon: UserRound,
  },
  {
    value: "employer",
    title: "Employer",
    description: "Post jobs and manage applicants.",
    icon: BriefcaseBusiness,
  },
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-700">
        Account Type <span className="text-red-500">*</span>
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map(
          ({
            value: role,
            title,
            description,
            icon: Icon,
          }) => {
            const selected = value === role;

            return (
              <button
                key={role}
                type="button"
                onClick={() => onChange(role)}
                className={[
                  "rounded-xl border p-4 text-left transition",
                  selected
                    ? "border-blue-700 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-300 bg-white hover:border-blue-300",
                ].join(" ")}
              >
                <Icon
                  size={22}
                  className={
                    selected
                      ? "text-blue-700"
                      : "text-slate-500"
                  }
                />

                <p className="mt-3 font-semibold text-slate-900">
                  {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {description}
                </p>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}