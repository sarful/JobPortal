import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    deleteContactMessage,
    getContactMessages,
    updateContactMessageStatus,
} from "../../api/contactApi";

import ContactMessageTable from "../../components/admin/ContactMessageTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";

export default function ManageMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [viewingMessage, setViewingMessage] =
    useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getContactMessages({
        page: 1,
        limit: 100,
      });

      setMessages(response?.data?.messages || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const changeStatus = async (message, status) => {
    try {
      await updateContactMessageStatus(
        message._id || message.id,
        status
      );

      toast.success("Message status updated.");
      loadMessages();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update message."
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);

      await deleteContactMessage(
        deleteTarget._id || deleteTarget.id
      );

      toast.success("Message deleted.");
      setDeleteTarget(null);
      loadMessages();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to delete message."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        description="Review and manage messages submitted by website visitors."
      />

      {loading ? (
        <Loader label="Loading messages..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={loadMessages}
        />
      ) : (
        <ContactMessageTable
          messages={messages}
          onView={setViewingMessage}
          onStatusChange={changeStatus}
          onDelete={setDeleteTarget}
        />
      )}

      <Modal
        isOpen={Boolean(viewingMessage)}
        onClose={() => setViewingMessage(null)}
        title={viewingMessage?.subject || "Contact Message"}
      >
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {viewingMessage?.name}
            </p>

            <p className="text-sm text-slate-500">
              {viewingMessage?.email}
            </p>
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
            {viewingMessage?.message}
          </p>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Message"
        message="Are you sure you want to permanently delete this contact message?"
        confirmText="Delete Message"
      />
    </div>
  );
}