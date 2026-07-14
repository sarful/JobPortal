import { MapPin, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

export default function JobSearchBar({
  initialSearch = "",
  initialLocation = "",
  onSearch,
}) {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setSearch(initialSearch);
    setLocation(initialLocation);
  }, [initialSearch, initialLocation]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch({
      search: search.trim(),
      location: location.trim(),
    });
  };

  const handleClear = () => {
    setSearch("");
    setLocation("");

    onSearch({
      search: "",
      location: "",
    });
  };

  const hasValue = search.trim() || location.trim();

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr_auto_auto]"
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
          placeholder="Job title, company, or skill"
          aria-label="Search jobs"
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

      <Button type="submit">
        <Search size={17} />
        Search
      </Button>

      {hasValue ? (
        <Button type="button" variant="outline" onClick={handleClear}>
          <X size={17} />
          Clear
        </Button>
      ) : null}
    </form>
  );
}