import { RotateCcw } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const categoryOptions = [
  { label: "Software Development", value: "software-development" },
  { label: "Design & Creative", value: "design-creative" },
  { label: "Marketing", value: "marketing" },
  { label: "Finance", value: "finance" },
  { label: "Customer Support", value: "customer-support" },
  { label: "Engineering", value: "engineering" },
  { label: "Data & Analytics", value: "data-analytics" },
];

const jobTypeOptions = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Temporary", value: "temporary" },
  { label: "Freelance", value: "freelance" },
];

const workplaceOptions = [
  { label: "On-site", value: "on-site" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

const experienceOptions = [
  { label: "Entry Level", value: "entry-level" },
  { label: "Junior", value: "junior" },
  { label: "Mid Level", value: "mid-level" },
  { label: "Senior", value: "senior" },
  { label: "Lead", value: "lead" },
  { label: "Manager", value: "manager" },
  { label: "Director", value: "director" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Salary: High to Low", value: "salary-high" },
  { label: "Salary: Low to High", value: "salary-low" },
  { label: "Deadline", value: "deadline" },
];

export default function JobFilters({
  filters,
  onChange,
  onReset,
}) {
  const updateFilter = (name, value) => {
    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Filter Jobs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Refine your job search.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
        >
          <RotateCcw size={15} />
          Reset
        </Button>
      </div>

      <div className="mt-6 space-y-5">
        <Select
          label="Category"
          value={filters.category || ""}
          onChange={(event) =>
            updateFilter("category", event.target.value)
          }
          options={categoryOptions}
          placeholder="All categories"
        />

        <Select
          label="Job Type"
          value={filters.jobType || ""}
          onChange={(event) =>
            updateFilter("jobType", event.target.value)
          }
          options={jobTypeOptions}
          placeholder="All job types"
        />

        <Select
          label="Workplace Type"
          value={filters.workplaceType || ""}
          onChange={(event) =>
            updateFilter("workplaceType", event.target.value)
          }
          options={workplaceOptions}
          placeholder="All workplace types"
        />

        <Select
          label="Experience Level"
          value={filters.experienceLevel || ""}
          onChange={(event) =>
            updateFilter("experienceLevel", event.target.value)
          }
          options={experienceOptions}
          placeholder="All experience levels"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Minimum Salary"
            type="number"
            min="0"
            value={filters.salaryMin || ""}
            onChange={(event) =>
              updateFilter("salaryMin", event.target.value)
            }
            placeholder="0"
          />

          <Input
            label="Maximum Salary"
            type="number"
            min="0"
            value={filters.salaryMax || ""}
            onChange={(event) =>
              updateFilter("salaryMax", event.target.value)
            }
            placeholder="Any"
          />
        </div>

        <Select
          label="Sort By"
          value={filters.sort || "newest"}
          onChange={(event) =>
            updateFilter("sort", event.target.value)
          }
          options={sortOptions}
          placeholder="Sort jobs"
        />
      </div>
    </aside>
  );
}