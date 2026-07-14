import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <SearchX size={38} />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-wider text-blue-700">
          Error 404
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-950">
          Page Not Found
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          The requested page may have been removed, renamed, or does
          not exist.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <Link to="/">
            <Button size="lg">Return Home</Button>
          </Link>

          <Link to="/jobs">
            <Button size="lg" variant="outline">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}