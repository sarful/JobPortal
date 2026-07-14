import {
    BriefcaseBusiness,
    Building2,
    MapPin,
    Search,
    Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";

export default function HeroSection() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const queryString = params.toString();

    navigate(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <BriefcaseBusiness size={16} />
            Find your next career opportunity
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Find the right job and build your
            <span className="text-blue-700"> future</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover opportunities from trusted employers, apply online,
            and manage your career from one modern platform.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              />

              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Job title or keyword"
                aria-label="Search by job title"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              />

              <Input
                type="search"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
                aria-label="Search by location"
                className="pl-10"
              />
            </div>

            <Button type="submit" size="lg">
              <Search size={18} />
              Search Jobs
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-slate-500">
              Popular searches:
            </span>

            {["React Developer", "Designer", "Marketing", "Remote"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setSearch(item);
                    navigate(`/jobs?search=${encodeURIComponent(item)}`);
                  }}
                  className="rounded-full bg-white px-3 py-1.5 text-slate-600 shadow-sm transition hover:text-blue-700"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-slate-950 p-7 text-white">
              <p className="text-sm font-medium text-blue-300">
                Career opportunities
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Connect with companies hiring now
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <HeroStat
                  icon={BriefcaseBusiness}
                  value="2,500+"
                  label="Active jobs"
                />

                <HeroStat
                  icon={Building2}
                  value="850+"
                  label="Companies"
                />

                <HeroStat
                  icon={Users}
                  value="18K+"
                  label="Candidates"
                />

                <HeroStat
                  icon={MapPin}
                  value="50+"
                  label="Locations"
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Recently posted
                  </p>

                  <h3 className="mt-1 font-bold text-slate-900">
                    Senior Frontend Developer
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    TechNova Solutions · Dhaka
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Full-time
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "JavaScript", "Tailwind CSS"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ icon: Icon, value, label }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <Icon size={20} className="text-blue-300" />

      <p className="mt-3 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}