"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import LessonCard from "@/components/lessons/LessonCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Crown, Pencil, Loader2, BookMarked, Heart, X, Check } from "lucide-react";

export default function ProfilePage() {
  const { user, isPremium, updateUser } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", photoURL: user?.photoURL || "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    api
      .get("/lessons/my")
      .then((res) => setLessons(res.data.lessons))
      .catch(console.error)
      .finally(() => setLoadingLessons(false));

    api
      .get("/favorites/my")
      .then((res) => setFavoritesCount(res.data.lessons.length))
      .catch(console.error);
  }, [user]);

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

  const publicLessons = lessons.filter((l) => l.visibility === "Public");

  if (!user) return <LoadingSpinner fullPage />;

  return (
    <div>
      {/* Profile header card */}
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
                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                {isPremium && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                    <Crown size={11} fill="currentColor" />
                    Premium
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4">{user.email}</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-sm text-gray-300">
                  <BookMarked size={15} className="text-violet-400" />
                  <span className="font-semibold">{lessons.length}</span>
                  <span className="text-gray-500">created</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-300">
                  <Heart size={15} className="text-rose-400" />
                  <span className="font-semibold">{favoritesCount}</span>
                  <span className="text-gray-500">saved</span>
                </div>
              </div>
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
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
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

      {/* Public lessons grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-5">
          My Public Lessons {publicLessons.length > 0 && `(${publicLessons.length})`}
        </h2>

        {loadingLessons ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : publicLessons.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500">No public lessons yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} isCurrentUserPremium={isPremium} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
