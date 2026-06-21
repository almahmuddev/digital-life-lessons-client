"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import {
  Eye,
  EyeOff,
  Heart,
  Bookmark,
  Pencil,
  Trash2,
  PlusCircle,
  Crown,
  Lock,
} from "lucide-react";

export default function MyLessonsPage() {
  const { isPremium } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // tracks which row is mid-toggle

  const fetchLessons = () => {
    setLoading(true);
    api
      .get("/lessons/my")
      .then((res) => setLessons(res.data.lessons))
      .catch(() => toast.error("Failed to load your lessons"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // ── Toggle visibility (Public / Private) ──────────────────────────────────
  const handleToggleVisibility = async (lesson) => {
    setUpdatingId(lesson._id);
    try {
      const res = await api.patch(`/lessons/${lesson._id}/visibility`);
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lesson._id ? { ...l, visibility: res.data.visibility } : l
        )
      );
      toast.success(`Lesson is now ${res.data.visibility}`);
    } catch (err) {
      toast.error("Failed to update visibility");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Toggle access level (Free / Premium) — premium users only ─────────────
  const handleToggleAccessLevel = async (lesson) => {
    if (!isPremium) {
      toast.error("Upgrade to Premium to create paid lessons");
      return;
    }

    const newLevel = lesson.accessLevel === "Free" ? "Premium" : "Free";
    setUpdatingId(lesson._id);
    try {
      await api.patch(`/lessons/${lesson._id}`, { accessLevel: newLevel });
      setLessons((prev) =>
        prev.map((l) =>
          l._id === lesson._id ? { ...l, accessLevel: newLevel } : l
        )
      );
      toast.success(`Access level changed to ${newLevel}`);
    } catch (err) {
      toast.error("Failed to update access level");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Delete lesson ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/lessons/${deleteTarget._id}`);
      setLessons((prev) => prev.filter((l) => l._id !== deleteTarget._id));
      toast.success("Lesson deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete lesson");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">My Lessons</h1>
          <p className="text-gray-400 mt-1">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link
          href="/dashboard/add-lesson"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <PlusCircle size={16} />
          New Lesson
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-500 mb-4">You haven't created any lessons yet</p>
          <Link
            href="/dashboard/add-lesson"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <PlusCircle size={16} />
            Create your first lesson
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/60">
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Lesson</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Visibility</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Access</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Stats</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Created</th>
                  <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors"
                  >
                    {/* Lesson title + category */}
                    <td className="px-5 py-4">
                      <Link
                        href={`/lessons/${lesson._id}`}
                        className="font-medium text-white hover:text-violet-400 transition-colors line-clamp-1 max-w-[220px] block"
                      >
                        {lesson.title}
                      </Link>
                      <span className="text-xs text-gray-500">{lesson.category}</span>
                    </td>

                    {/* Visibility toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleVisibility(lesson)}
                        disabled={updatingId === lesson._id}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
                          lesson.visibility === "Public"
                            ? "bg-green-500/15 text-green-300 hover:bg-green-500/25"
                            : "bg-gray-700/40 text-gray-400 hover:bg-gray-700/60"
                        }`}
                      >
                        {lesson.visibility === "Public" ? <Eye size={12} /> : <EyeOff size={12} />}
                        {lesson.visibility}
                      </button>
                    </td>

                    {/* Access level toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleAccessLevel(lesson)}
                        disabled={updatingId === lesson._id || !isPremium}
                        title={!isPremium ? "Upgrade to Premium to enable" : ""}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          lesson.accessLevel === "Premium"
                            ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                            : "bg-gray-700/40 text-gray-400 hover:bg-gray-700/60"
                        }`}
                      >
                        {lesson.accessLevel === "Premium" ? <Crown size={12} /> : <Lock size={12} className="opacity-0" />}
                        {lesson.accessLevel}
                      </button>
                    </td>

                    {/* Stats */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Heart size={12} className="text-rose-400" />
                          {lesson.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark size={12} className="text-violet-400" />
                          {lesson.favoritesCount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Created date */}
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {formatDate(lesson.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/update-lesson/${lesson._id}`}
                          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-violet-600/20 hover:text-violet-300 text-gray-400 flex items-center justify-center transition-colors"
                          title="Update lesson"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(lesson)}
                          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-600/20 hover:text-red-300 text-gray-400 flex items-center justify-center transition-colors"
                          title="Delete lesson"
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
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this lesson?"
        description={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
      />
    </div>
  );
}
