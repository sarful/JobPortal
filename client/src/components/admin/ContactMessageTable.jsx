import { Eye, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

export default function ContactMessageTable({
  messages = [],
  onView,
  onStatusChange,
  onDelete,
}) {
  if (!messages.length) {
    return (
      <EmptyState
        title="No contact messages"
        description="Messages submitted through the contact form will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Sender",
              "Subject",
              "Status",
              "Received",
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
          {messages.map((message) => {
            const id = message._id || message.id;

            return (
              <tr key={id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {message.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {message.email}
                  </p>
                </td>

                <td className="max-w-xs px-5 py-4">
                  <p className="truncate text-sm text-slate-700">
                    {message.subject}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <select
                    value={message.status}
                    onChange={(event) =>
                      onStatusChange?.(message, event.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>

                  <div className="mt-2">
                    <StatusBadge status={message.status} />
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDate(message.createdAt)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView?.(message)}
                    >
                      <Eye size={15} />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete?.(message)}
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