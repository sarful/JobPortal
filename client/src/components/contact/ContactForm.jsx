import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { submitContactMessage } from "../../api/contactApi";
import Button from "../common/Button";
import Input from "../common/Input";
import TextArea from "../common/TextArea";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitForm = async (formData) => {
    try {
      const response = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      toast.success(
        response.message || "Message submitted successfully."
      );

      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to submit your message."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full Name"
          required
          error={errors.name?.message}
          {...register("name", {
            required: "Full name is required.",
            minLength: {
              value: 2,
              message: "Name must contain at least 2 characters.",
            },
          })}
        />

        <Input
          label="Email Address"
          type="email"
          required
          error={errors.email?.message}
          {...register("email", {
            required: "Email address is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          })}
        />
      </div>

      <Input
        label="Subject"
        required
        error={errors.subject?.message}
        {...register("subject", {
          required: "Subject is required.",
          maxLength: {
            value: 200,
            message: "Subject cannot exceed 200 characters.",
          },
        })}
      />

      <TextArea
        label="Message"
        rows={8}
        required
        error={errors.message?.message}
        {...register("message", {
          required: "Message is required.",
          minLength: {
            value: 10,
            message: "Message must contain at least 10 characters.",
          },
          maxLength: {
            value: 5000,
            message: "Message cannot exceed 5000 characters.",
          },
        })}
      />

      <Button type="submit" size="lg" loading={isSubmitting}>
        <Send size={18} />
        Send Message
      </Button>
    </form>
  );
}