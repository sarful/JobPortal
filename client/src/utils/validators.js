export const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const urlPattern =
  /^https?:\/\/[^\s]+$/i;

export const slugPattern =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateEmail = (value) => {
  if (!value?.trim()) {
    return "Email address is required.";
  }

  if (!emailPattern.test(value.trim())) {
    return "Enter a valid email address.";
  }

  return true;
};

export const validatePassword = (value) => {
  if (!value) {
    return "Password is required.";
  }

  if (value.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  return true;
};

export const validateUrl = (
  value,
  required = false
) => {
  if (!value?.trim()) {
    return required ? "URL is required." : true;
  }

  if (!urlPattern.test(value.trim())) {
    return "Enter a valid URL beginning with http:// or https://.";
  }

  return true;
};

export const validateFutureDate = (value) => {
  if (!value) {
    return "Date is required.";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Enter a valid date.";
  }

  if (date <= new Date()) {
    return "Date must be in the future.";
  }

  return true;
};

export const validateSalaryRange = (
  salaryMin,
  salaryMax
) => {
  if (
    salaryMin === "" ||
    salaryMin === null ||
    salaryMin === undefined ||
    salaryMax === "" ||
    salaryMax === null ||
    salaryMax === undefined
  ) {
    return true;
  }

  if (Number(salaryMin) > Number(salaryMax)) {
    return "Minimum salary cannot exceed maximum salary.";
  }

  return true;
};