import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import TextArea from "../common/TextArea";

const jobTypes = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "temporary",
  "freelance",
].map(toOption);

const workplaceTypes = [
  "on-site",
  "remote",
  "hybrid",
].map(toOption);

const experienceLevels = [
  "entry-level",
  "junior",
  "mid-level",
  "senior",
  "lead",
  "manager",
  "director",
].map(toOption);

const statuses = ["draft", "active", "closed"].map(toOption);

export default function JobForm({
  initialData,
  onSubmit,
  submitLabel = "Save Job",
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: createDefaults(initialData),
  });

  const workplaceType = watch("workplaceType");

  useEffect(() => {
    reset(createDefaults(initialData));
  }, [initialData, reset]);

  const submitForm = (formData) => {
    onSubmit({
      ...formData,
      salaryMin: formData.salaryMin
        ? Number(formData.salaryMin)
        : null,
      salaryMax: formData.salaryMax
        ? Number(formData.salaryMax)
        : null,
      vacancies: Number(formData.vacancies),
      skills: splitLines(formData.skills),
      responsibilities: splitLines(formData.responsibilities),
      requirements: splitLines(formData.requirements),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Job Title"
          required
          error={errors.title?.message}
          {...register("title", {
            required: "Job title is required.",
          })}
        />

        <Input
          label="Company Name"
          required
          error={errors.companyName?.message}
          {...register("companyName", {
            required: "Company name is required.",
          })}
        />

        <Input
          label="Company Logo URL"
          {...register("companyLogo")}
        />

        <Input
          label="Category"
          required
          error={errors.category?.message}
          {...register("category", {
            required: "Category is required.",
          })}
        />

        <Select
          label="Job Type"
          options={jobTypes}
          required
          error={errors.jobType?.message}
          {...register("jobType", {
            required: "Job type is required.",
          })}
        />

        <Select
          label="Workplace Type"
          options={workplaceTypes}
          required
          error={errors.workplaceType?.message}
          {...register("workplaceType", {
            required: "Workplace type is required.",
          })}
        />

        <Input
          label="Location"
          required={workplaceType !== "remote"}
          error={errors.location?.message}
          {...register("location", {
            validate: (value) =>
              workplaceType === "remote" ||
              value.trim().length > 0 ||
              "Location is required.",
          })}
        />

        <Select
          label="Experience Level"
          options={experienceLevels}
          {...register("experienceLevel")}
        />

        <Input
          label="Education Level"
          {...register("educationLevel")}
        />

        <Input
          label="Vacancies"
          type="number"
          min="1"
          required
          {...register("vacancies", {
            required: true,
            min: 1,
          })}
        />

        <Input
          label="Minimum Salary"
          type="number"
          min="0"
          {...register("salaryMin")}
        />

        <Input
          label="Maximum Salary"
          type="number"
          min="0"
          {...register("salaryMax")}
        />

        <Input
          label="Salary Currency"
          {...register("salaryCurrency")}
        />

        <Select
          label="Salary Period"
          options={[
            "hourly",
            "daily",
            "weekly",
            "monthly",
            "yearly",
          ].map(toOption)}
          {...register("salaryPeriod")}
        />

        <Input
          label="Application Deadline"
          type="date"
          required
          error={errors.deadline?.message}
          {...register("deadline", {
            required: "Deadline is required.",
          })}
        />

        <Select
          label="Status"
          options={statuses}
          {...register("status")}
        />
      </div>

      <TextArea
        label="Job Description"
        rows={8}
        required
        error={errors.description?.message}
        {...register("description", {
          required: "Job description is required.",
          minLength: {
            value: 20,
            message: "Description must contain 20 characters.",
          },
        })}
      />

      <TextArea
        label="Responsibilities"
        rows={6}
        helperText="Enter one responsibility per line."
        {...register("responsibilities")}
      />

      <TextArea
        label="Requirements"
        rows={6}
        helperText="Enter one requirement per line."
        {...register("requirements")}
      />

      <TextArea
        label="Required Skills"
        rows={5}
        helperText="Enter one skill per line or separate with commas."
        {...register("skills")}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={loading} size="lg">
          <Save size={18} />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function createDefaults(job = {}) {
  return {
    title: job.title || "",
    companyName: job.companyName || "",
    companyLogo: job.companyLogo || "",
    category: job.category || "",
    jobType: job.jobType || "full-time",
    workplaceType: job.workplaceType || "on-site",
    location: job.location || "",
    salaryMin: job.salaryMin ?? "",
    salaryMax: job.salaryMax ?? "",
    salaryCurrency: job.salaryCurrency || "BDT",
    salaryPeriod: job.salaryPeriod || "monthly",
    description: job.description || "",
    responsibilities: joinLines(job.responsibilities),
    requirements: joinLines(job.requirements),
    skills: joinLines(job.skills),
    experienceLevel: job.experienceLevel || "",
    educationLevel: job.educationLevel || "",
    vacancies: job.vacancies || 1,
    deadline: job.deadline
      ? new Date(job.deadline).toISOString().slice(0, 10)
      : "",
    status: job.status || "active",
  };
}

function splitLines(value = "") {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value) {
  return Array.isArray(value) ? value.join("\n") : value || "";
}

function toOption(value) {
  return {
    value,
    label: value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase()),
  };
}