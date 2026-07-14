import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateProfile } from "../../api/userApi";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import TextArea from "../common/TextArea";

const companySizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001+",
].map((value) => ({ label: value, value }));

export default function CompanyProfileForm({ profile }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: createDefaults(profile),
  });

  useEffect(() => {
    reset(createDefaults(profile));
  }, [profile, reset]);

  const submitProfile = async (formData) => {
    try {
      const response = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        profileImage: formData.profileImage,
        companyProfile: {
          ...formData.companyProfile,
          foundedYear: formData.companyProfile.foundedYear
            ? Number(formData.companyProfile.foundedYear)
            : undefined,
        },
      });

      toast.success(
        response.message || "Company profile updated."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update company profile."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitProfile)}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <h2 className="text-xl font-bold text-slate-900">
        Company Information
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Input
          label="Account Holder Name"
          required
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required.",
          })}
        />

        <Input label="Phone Number" {...register("phone")} />

        <Input label="Location" {...register("location")} />

        <Input
          label="Profile Image URL"
          {...register("profileImage")}
        />

        <Input
          label="Company Name"
          required
          error={
            errors.companyProfile?.companyName?.message
          }
          {...register("companyProfile.companyName", {
            required: "Company name is required.",
          })}
        />

        <Input
          label="Company Logo URL"
          {...register("companyProfile.companyLogo")}
        />

        <Input
          label="Company Email"
          type="email"
          {...register("companyProfile.companyEmail")}
        />

        <Input
          label="Company Phone"
          {...register("companyProfile.phone")}
        />

        <Input
          label="Website"
          type="url"
          {...register("companyProfile.website")}
        />

        <Input
          label="Industry"
          {...register("companyProfile.industry")}
        />

        <Select
          label="Company Size"
          options={companySizeOptions}
          {...register("companyProfile.companySize")}
        />

        <Input
          label="Founded Year"
          type="number"
          min="1800"
          max={new Date().getFullYear()}
          {...register("companyProfile.foundedYear")}
        />

        <div className="md:col-span-2">
          <Input
            label="Office Address"
            {...register("companyProfile.address")}
          />
        </div>

        <Input
          label="LinkedIn URL"
          {...register("companyProfile.linkedinUrl")}
        />

        <Input
          label="Facebook URL"
          {...register("companyProfile.facebookUrl")}
        />

        <div className="md:col-span-2">
          <TextArea
            label="Company Description"
            rows={7}
            {...register("companyProfile.description")}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          <Save size={17} />
          Save Company Profile
        </Button>
      </div>
    </form>
  );
}

function createDefaults(profile = {}) {
  return {
    name: profile?.name || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    profileImage: profile?.profileImage || "",
    companyProfile: {
      companyName: profile?.companyProfile?.companyName || "",
      companyLogo: profile?.companyProfile?.companyLogo || "",
      companyEmail: profile?.companyProfile?.companyEmail || "",
      phone: profile?.companyProfile?.phone || "",
      website: profile?.companyProfile?.website || "",
      industry: profile?.companyProfile?.industry || "",
      companySize: profile?.companyProfile?.companySize || "",
      foundedYear: profile?.companyProfile?.foundedYear || "",
      address: profile?.companyProfile?.address || "",
      description: profile?.companyProfile?.description || "",
      linkedinUrl: profile?.companyProfile?.linkedinUrl || "",
      facebookUrl: profile?.companyProfile?.facebookUrl || "",
    },
  };
}