"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { Crown, ShieldCheck, Shield, Trash2 } from "lucide-react";

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    setUpdatingId(targetUser._id);
    try {
      await api.patch(`/admin/users/${targetUser._id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
      toast.success(`${targetUser.name} is now ${newRole === "admin" ? "an Admin" : "a regular user"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      toast.success("User deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Manage Users</h1>
        <p className="text-gray-400 mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">User</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Role</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Plan</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Lessons</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`flex items-center gap-1.5 w-fit text-xs font-medium px-2.5 py-1 rounded-full ${u.role === "admin"
                          ? "bg-blue-500/15 text-blue-300"
                          : "bg-gray-700/40 text-gray-400"
                        }`}
                    >
                      {u.role === "admin" ? <ShieldCheck size={11} /> : <Shield size={11} />}
                      {u.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {u.isPremium ? (
                      <span className="flex items-center gap-1 w-fit text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300">
                        <Crown size={11} />
                        Premium
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Free</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {u.lessonCount} lesson{u.lessonCount !== 1 ? "s" : ""}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={updatingId === u._id || u._id === currentUser?._id}
                        title={u._id === currentUser?._id ? "You can't change your own role" : ""}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-blue-600/20 hover:text-blue-300 text-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        disabled={u._id === currentUser?._id}
                        title={u._id === currentUser?._id ? "You can't delete yourself" : ""}
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-600/20 hover:text-red-300 text-gray-400 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this user?"
        description={`"${deleteTarget?.name}" and all their lessons will be permanently removed.`}
      />
    </div>
  );
}
