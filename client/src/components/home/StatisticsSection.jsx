import {
    BriefcaseBusiness,
    Building2,
    MapPinned,
    UserCheck,
} from "lucide-react";

const statistics = [
  {
    icon: BriefcaseBusiness,
    value: "2,500+",
    label: "Active job listings",
  },
  {
    icon: Building2,
    value: "850+",
    label: "Registered companies",
  },
  {
    icon: UserCheck,
    value: "18,000+",
    label: "Registered candidates",
  },
  {
    icon: MapPinned,
    value: "50+",
    label: "Locations covered",
  },
];

export default function StatisticsSection() {
  return (
    <section className="bg-blue-700 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Icon size={24} />
              </div>

              <p className="mt-5 text-3xl font-bold">{value}</p>

              <p className="mt-2 text-sm text-blue-100">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}