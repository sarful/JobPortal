import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import Input from "../common/Input";
import TextArea from "../common/TextArea";

export default function CategoryForm({
  category,
  onSubmit,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: createDefaults(category),
  });

  useEffect(() => {
    reset(createDefaults(category));
  }, [category, reset]);

  const submitForm = (formData) => {
    onSubmit?.({
      ...formData,
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase(),
      description: formData.description.trim(),
      icon: formData.icon.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <h2 className="text-xl font-bold text-slate-900">
        {category ? "Edit Category" : "Create Category"}
      </h2>

      <Input
        label="Category Name"
        required
        error={errors.name?.message}
        {...register("name", {
          required: "Category name is required.",
        })}
      />

      <Input
        label="Slug"
        required
        placeholder="software-development"
        error={errors.slug?.message}
        {...register("slug", {
          required: "Slug is required.",
          pattern: {
            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            message:
              "Use lowercase letters, numbers, and hyphens only.",
          },
        })}
      />

      <Input
        label="Icon"
        placeholder="Code2"
        {...register("icon")}
      />

      <TextArea
        label="Description"
        rows={4}
        {...register("description")}
      />

      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          {...register("isActive")}
        />
        Active category
      </label>

      <Button type="submit" loading={loading}>
        <Save size={17} />
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}

function createDefaults(category = {}) {
  return {
    name: category?.name || "",
    slug: category?.slug || "",
    icon: category?.icon || "",
    description: category?.description || "",
    isActive: category?.isActive ?? true,
  };
}