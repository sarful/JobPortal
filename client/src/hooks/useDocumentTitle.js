import { useEffect } from "react";

export default function useDocumentTitle(
  title,
  suffix = "JobPortal"
) {
  useEffect(() => {
    const previousTitle = document.title;

    document.title = title
      ? `${title} | ${suffix}`
      : suffix;

    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
}