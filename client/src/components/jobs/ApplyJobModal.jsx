import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { applyForJob } from "../../api/applicationApi";
import { useAuthStore } from "../../store/authStore";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import TextArea from "../common/TextArea";

export default function ApplyJobModal({
  isOpen,
  onClose,
  job,
  onApplied,
}) {
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      resumeUrl: user?.resumeUrl || "",
      portfolioUrl: user?.portfolioUrl || "",
      expectedSalary: "",
      coverLetter: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        resumeUrl: user?.resumeUrl || "",
        portfolioUrl: user?.portfolioUrl || "",
        expectedSalary: "",
        coverLetter: "",
      });
    }
  }, [isOpen, reset, user]);

  const submitApplication = async (formData) => {
    try {
      const payload = {
        resumeUrl: formData.resumeUrl.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        coverLetter: formData.coverLetter.trim(),
        expectedSalary: formData.expectedSalary
          ? Number(formData.expectedSalary)
          : undefined,
      };

      const response = await applyForJob(
        job._id || job.id,
        payload
      );

      toast.success(
        response?.message || "Application submitted successfully."
      );

      onApplied?.(response?.data?.application);
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to submit your application."
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${job?.title || "this job"}`}
      size="lg"
    >
      <form
        onSubmit={handleSubmit(submitApplication)}
        className="space-y-5"
      >
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            {job?.companyName}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {job?.location} · {formatLabel(job?.jobType)}
          </p>
        </div>

        <Input
          label="Resume URL"
          type="url"
          required
          placeholder="https://example.com/resume.pdf"
          error={errors.resumeUrl?.message}
          {...register("resumeUrl", {
            required: "Resume URL is required.",
            pattern: {
              value: /^https?:\/\/.+/i,
              message: "Enter a valid resume URL.",
            },
          })}
        />

        <Input
          label="Portfolio URL"
          type="url"
          placeholder="https://example.com/portfolio"
          error={errors.portfolioUrl?.message}
          {...register("portfolioUrl", {
            pattern: {
              value: /^$|^https?:\/\/.+/i,
              message: "Enter a valid portfolio URL.",
            },
          })}
        />

        <Input
          label="Expected Salary"
          type="number"
          min="0"
          placeholder="Optional"
          error={errors.expectedSalary?.message}
          {...register("expectedSalary", {
            min: {
              value: 0,
              message: "Expected salary cannot be negative.",
            },
          })}
        />

        <TextArea
          label="Cover Letter"
          rows={7}
          placeholder="Explain why you are suitable for this role..."
          error={errors.coverLetter?.message}
          {...register("coverLetter", {
            maxLength: {
              value: 5000,
              message:
                "Cover letter cannot exceed 5000 characters.",
            },
          })}
        />

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function formatLabel(value) {
  if (!value) {
    return "Not specified";
  }

  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}