"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ShieldCheck, Pencil, Loader2, Check, X, BookOpen, Flag, Users } from "lucide-react";

export default function AdminProfilePage() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", photoURL: user?.photoURL || "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoadingStats(false));
  }, []);

  const handleEditOpen = () => {
    setForm({ name: user.name, photoURL: user.photoURL || "" });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch("/auth/profile", form);
      updateUser(res.data.user);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Admin Profile</h1>
        <p className="text-gray-400 mt-1">Manage your administrator account</p>
      </div>

      {/* Profile card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8">
        {!editing ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-700"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full">
                  <ShieldCheck size={11} />
                  Admin
                </span>
              </div>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
            <button
              onClick={handleEditOpen}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors self-start"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Edit Profile</h2>
              <button type="button" onClick={() => setEditing(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={form.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${form.name}`}
                alt="Preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-700 flex-shrink-0"
              />
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={form.photoURL}
                  onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
                Email <span className="text-gray-600 normal-case">(cannot be changed)</span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-800/50 border border-gray-800 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Activity summary */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Platform Activity Summary</h2>
        {loadingStats ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Users size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none">{stats?.totalUsers ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total Users</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none">{stats?.totalLessons ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total Lessons</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Flag size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none">{stats?.totalReportedLessons ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Reports Moderated</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
