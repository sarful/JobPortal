import { Eye, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

export default function UserTable({
  users = [],
  onView,
  onToggleBlock,
  onDelete,
}) {
  if (!users.length) {
    return (
      <EmptyState
        title="No users found"
        description="Registered users will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {[
              "User",
              "Role",
              "Status",
              "Joined",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {users.map((user) => {
            const id = user._id || user.id;

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-slate-900">
                        {user.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={user.role} />
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={user.isBlocked ? "blocked" : "active"}
                  />
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDate(user.createdAt)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView?.(user)}
                    >
                      <Eye size={15} />
                    </Button>

                    <Button
                      size="sm"
                      variant={user.isBlocked ? "success" : "secondary"}
                      onClick={() => onToggleBlock?.(user)}
                    >
                      {user.isBlocked ? (
                        <ShieldCheck size={15} />
                      ) : (
                        <ShieldBan size={15} />
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete?.(user)}
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