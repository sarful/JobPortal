import {
    BarChart3,
    BriefcaseBusiness,
    Code2,
    Coins,
    Headphones,
    Megaphone,
    Palette,
    Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Software Development",
    slug: "software-development",
    icon: Code2,
    jobs: 328,
  },
  {
    name: "Design & Creative",
    slug: "design-creative",
    icon: Palette,
    jobs: 174,
  },
  {
    name: "Marketing",
    slug: "marketing",
    icon: Megaphone,
    jobs: 215,
  },
  {
    name: "Finance",
    slug: "finance",
    icon: Coins,
    jobs: 143,
  },
  {
    name: "Customer Support",
    slug: "customer-support",
    icon: Headphones,
    jobs: 198,
  },
  {
    name: "Engineering",
    slug: "engineering",
    icon: Settings,
    jobs: 267,
  },
  {
    name: "Business Operations",
    slug: "business-operations",
    icon: BriefcaseBusiness,
    jobs: 121,
  },
  {
    name: "Data & Analytics",
    slug: "data-analytics",
    icon: BarChart3,
    jobs: 189,
  },
];

export default function PopularCategoriesSection() {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/jobs?category=${encodeURIComponent(slug)}`);
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Browse by category
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Popular job categories
          </h2>

          <p className="mt-4 text-slate-600">
            Find opportunities that match your skills, experience, and
            professional interests.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => handleCategoryClick(category.slug)}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {category.jobs.toLocaleString()} open positions
                </p>

                <p className="mt-5 text-sm font-semibold text-blue-700">
                  Explore jobs →
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}