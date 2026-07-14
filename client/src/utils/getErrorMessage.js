export const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  if (!error) {
    return fallback;
  }

  const validationErrors =
    error.response?.data?.errors;

  if (
    Array.isArray(validationErrors) &&
    validationErrors.length > 0
  ) {
    return validationErrors
      .map((item) => item.message)
      .filter(Boolean)
      .join(", ");
  }

  return (
    error.response?.data?.message ||
    error.message ||
    fallback
  );
};