import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {pages[0] > 1 ? (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="h-10 min-w-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            1
          </button>

          {pages[0] > 2 ? (
            <span className="px-1 text-slate-500">...</span>
          ) : null}
        </>
      ) : null}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={
            page === currentPage ? "page" : undefined
          }
          className={[
            "h-10 min-w-10 rounded-lg border px-3 text-sm font-medium transition",
            page === currentPage
              ? "border-blue-700 bg-blue-700 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
          ].join(" ")}
        >
          {page}
        </button>
      ))}

      {pages.at(-1) < totalPages ? (
        <>
          {pages.at(-1) < totalPages - 1 ? (
            <span className="px-1 text-slate-500">...</span>
          ) : null}

          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="h-10 min-w-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {totalPages}
          </button>
        </>
      ) : null}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}