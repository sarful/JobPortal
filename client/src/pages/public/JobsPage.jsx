import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAllJobs } from "../../api/jobApi";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import JobFilters from "../../components/jobs/JobFilters";
import JobList from "../../components/jobs/JobList";
import JobSearchBar from "../../components/jobs/JobSearchBar";

const defaultFilters = {
  search: "",
  location: "",
  category: "",
  jobType: "",
  workplaceType: "",
  experienceLevel: "",
  salaryMin: "",
  salaryMax: "",
  sort: "newest",
  page: 1,
  limit: 9,
};

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
  }));

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalJobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== "" && value !== null
        )
      );

      const response = await getAllJobs(params);

      setJobs(response?.data?.jobs || []);
      setPagination(
        response?.data?.pagination || {
          page: 1,
          totalPages: 1,
          totalJobs: 0,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const updateUrl = (nextFilters) => {
    const params = {};

    ["search", "location", "category"].forEach((key) => {
      if (nextFilters[key]) {
        params[key] = nextFilters[key];
      }
    });

    setSearchParams(params);
  };

  const handleSearch = ({ search, location }) => {
    const nextFilters = {
      ...filters,
      search,
      location,
      page: 1,
    };

    setFilters(nextFilters);
    updateUrl(nextFilters);
  };

  const handleFilterChange = (nextFilters) => {
    setFilters({
      ...nextFilters,
      page: 1,
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title="Find Your Next Job"
        description={`${pagination.totalJobs || 0} active opportunities available.`}
      />

      <JobSearchBar
        initialSearch={filters.search}
        initialLocation={filters.location}
        onSearch={handleSearch}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <JobFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <div>
          <JobList
            jobs={jobs}
            loading={loading}
            error={error}
            onRetry={loadJobs}
          />

          <div className="mt-10">
            <Pagination
              currentPage={pagination.page || filters.page}
              totalPages={pagination.totalPages || 1}
              onPageChange={(page) =>
                setFilters((current) => ({
                  ...current,
                  page,
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}