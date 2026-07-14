export const formatCurrency = (
  value,
  currency = "BDT",
  options = {}
) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Negotiable";
  }

  try {
    return new Intl.NumberFormat(
      options.locale || "en-BD",
      {
        style: "currency",
        currency: currency || "BDT",
        maximumFractionDigits: 0,
        ...options,
      }
    ).format(amount);
  } catch {
    return `${currency || "BDT"} ${amount.toLocaleString()}`;
  }
};

export const formatSalaryRange = ({
  salaryMin,
  salaryMax,
  salaryCurrency = "BDT",
} = {}) => {
  const hasMinimum =
    salaryMin !== null &&
    salaryMin !== undefined &&
    salaryMin !== "";

  const hasMaximum =
    salaryMax !== null &&
    salaryMax !== undefined &&
    salaryMax !== "";

  if (!hasMinimum && !hasMaximum) {
    return "Negotiable";
  }

  if (hasMinimum && hasMaximum) {
    return `${formatCurrency(
      salaryMin,
      salaryCurrency
    )} - ${formatCurrency(
      salaryMax,
      salaryCurrency
    )}`;
  }

  if (hasMinimum) {
    return `From ${formatCurrency(
      salaryMin,
      salaryCurrency
    )}`;
  }

  return `Up to ${formatCurrency(
    salaryMax,
    salaryCurrency
  )}`;
};