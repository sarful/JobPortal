import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldX size={38} />
        </div>

        <h1 className="mt-6 text-4xl font-bold text-slate-950">
          Access Denied
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Your account does not have permission to access this page.
        </p>

        <div className="mt-7">
          <Link to="/">
            <Button size="lg">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}