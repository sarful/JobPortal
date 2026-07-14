import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    deleteAdminUser,
    getAdminUsers,
    updateUserStatus,
} from "../../api/adminApi";

import UserTable from "../../components/admin/UserTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers({
        page: 1,
        limit: 100,
      });

      setUsers(response?.data?.users || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBlock = async (user) => {
    try {
      await updateUserStatus(
        user._id || user.id,
        !user.isBlocked
      );

      toast.success(
        user.isBlocked
          ? "User account unblocked."
          : "User account blocked."
      );

      loadUsers();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update user."
      );
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      setDeleting(true);

      await deleteAdminUser(
        selectedUser._id || selectedUser.id
      );

      toast.success("User deleted successfully.");
      setSelectedUser(null);
      loadUsers();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="Review, block, unblock, and remove user accounts."
      />

      {loading ? (
        <Loader label="Loading users..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadUsers} />
      ) : (
        <UserTable
          users={users}
          onToggleBlock={toggleBlock}
          onDelete={setSelectedUser}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete User"
        message="Deleting this user may affect their jobs and applications. Continue?"
        confirmText="Delete User"
      />
    </div>
  );
}