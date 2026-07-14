import { Edit3, Trash2 } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

export default function CategoryTable({
  categories = [],
  onEdit,
  onDelete,
}) {
  if (!categories.length) {
    return (
      <EmptyState
        title="No categories found"
        description="Create a category to organize job posts."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {["Name", "Slug", "Status", "Actions"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {categories.map((category) => {
            const id = category._id || category.id;

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {category.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {category.description || "No description"}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {category.slug}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={category.isActive ? "active" : "closed"}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit?.(category)}
                    >
                      <Edit3 size={15} />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete?.(category)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}