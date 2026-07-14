import { AlertCircle } from "lucide-react";

export default function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 shrink-0 text-red-600"
          size={20}
        />

        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            {message}
          </p>

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-semibold text-red-700 underline hover:text-red-900"
            >
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}