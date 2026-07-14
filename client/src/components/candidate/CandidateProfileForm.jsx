import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateProfile } from "../../api/userApi";
import { useAuthStore } from "../../store/authStore";
import Button from "../common/Button";
import Input from "../common/Input";
import TextArea from "../common/TextArea";

export default function CandidateProfileForm({ profile }) {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: createDefaults(profile),
  });

  const educationFields = useFieldArray({
    control,
    name: "education",
  });

  const experienceFields = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    reset(createDefaults(profile));
  }, [profile, reset]);

  const submitProfile = async (formData) => {
    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await updateProfile(payload);
      const updatedUser = response?.data?.user;

      if (updatedUser) {
        setUser?.(updatedUser);
      }

      toast.success(
        response.message || "Profile updated successfully."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitProfile)}
      className="space-y-8"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Personal Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            required
            error={errors.name?.message}
            {...register("name", {
              required: "Full name is required.",
            })}
          />

          <Input label="Phone Number" {...register("phone")} />

          <Input label="Location" {...register("location")} />

          <Input
            label="Professional Title"
            {...register("professionalTitle")}
          />

          <Input
            label="Profile Image URL"
            type="url"
            {...register("profileImage")}
          />

          <Input
            label="Resume URL"
            type="url"
            {...register("resumeUrl")}
          />

          <Input
            label="Portfolio URL"
            type="url"
            {...register("portfolioUrl")}
          />

          <Input
            label="LinkedIn URL"
            type="url"
            {...register("linkedinUrl")}
          />
        </div>

        <div className="mt-5">
          <Input
            label="Skills"
            placeholder="React, Node.js, MongoDB"
            helperText="Separate multiple skills with commas."
            {...register("skills")}
          />
        </div>

        <div className="mt-5">
          <TextArea
            label="Professional Biography"
            rows={6}
            {...register("bio")}
          />
        </div>
      </section>

      <DynamicSection
        title="Education"
        fields={educationFields.fields}
        onAdd={() =>
          educationFields.append({
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
        onRemove={educationFields.remove}
        renderField={(field, index) => (
          <div
            key={field.id}
            className="grid gap-4 rounded-xl bg-slate-50 p-5 md:grid-cols-2"
          >
            <Input
              label="Institution"
              {...register(`education.${index}.institution`)}
            />

            <Input
              label="Degree"
              {...register(`education.${index}.degree`)}
            />

            <Input
              label="Field of Study"
              {...register(`education.${index}.fieldOfStudy`)}
            />

            <Input
              label="Start Date"
              type="date"
              {...register(`education.${index}.startDate`)}
            />

            <Input
              label="End Date"
              type="date"
              {...register(`education.${index}.endDate`)}
            />

            <div className="md:col-span-2">
              <TextArea
                label="Description"
                rows={3}
                {...register(`education.${index}.description`)}
              />
            </div>
          </div>
        )}
      />

      <DynamicSection
        title="Work Experience"
        fields={experienceFields.fields}
        onAdd={() =>
          experienceFields.append({
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
        onRemove={experienceFields.remove}
        renderField={(field, index) => (
          <div
            key={field.id}
            className="grid gap-4 rounded-xl bg-slate-50 p-5 md:grid-cols-2"
          >
            <Input
              label="Company"
              {...register(`experience.${index}.company`)}
            />

            <Input
              label="Position"
              {...register(`experience.${index}.position`)}
            />

            <Input
              label="Location"
              {...register(`experience.${index}.location`)}
            />

            <Input
              label="Start Date"
              type="date"
              {...register(`experience.${index}.startDate`)}
            />

            <Input
              label="End Date"
              type="date"
              {...register(`experience.${index}.endDate`)}
            />

            <div className="md:col-span-2">
              <TextArea
                label="Description"
                rows={3}
                {...register(`experience.${index}.description`)}
              />
            </div>
          </div>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} size="lg">
          <Save size={18} />
          Save Profile
        </Button>
      </div>
    </form>
  );
}

function DynamicSection({
  title,
  fields,
  onAdd,
  onRemove,
  renderField,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus size={17} />
          Add
        </Button>
      </div>

      <div className="mt-6 space-y-5">
        {fields.map((field, index) => (
          <div key={field.id}>
            {renderField(field, index)}

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function createDefaults(profile = {}) {
  return {
    name: profile?.name || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    professionalTitle: profile?.professionalTitle || "",
    profileImage: profile?.profileImage || "",
    resumeUrl: profile?.resumeUrl || "",
    portfolioUrl: profile?.portfolioUrl || "",
    linkedinUrl: profile?.linkedinUrl || "",
    bio: profile?.bio || "",
    skills: Array.isArray(profile?.skills)
      ? profile.skills.join(", ")
      : "",
    education: profile?.education || [],
    experience: profile?.experience || [],
  };
}