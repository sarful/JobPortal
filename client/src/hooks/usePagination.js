import { useMemo, useState } from "react";

export default function usePagination({
  initialPage = 1,
  initialLimit = 10,
  totalItems = 0,
} = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil(Number(totalItems) / Number(limit))
      ),
    [totalItems, limit]
  );

  const goToPage = (nextPage) => {
    const safePage = Math.min(
      Math.max(Number(nextPage) || 1, 1),
      totalPages
    );

    setPage(safePage);
  };

  const nextPage = () => {
    goToPage(page + 1);
  };

  const previousPage = () => {
    goToPage(page - 1);
  };

  const resetPage = () => {
    setPage(1);
  };

  const changeLimit = (nextLimit) => {
    setLimit(Math.max(Number(nextLimit) || 1, 1));
    setPage(1);
  };

  return {
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    setPage: goToPage,
    setLimit: changeLimit,
    nextPage,
    previousPage,
    resetPage,
  };
}