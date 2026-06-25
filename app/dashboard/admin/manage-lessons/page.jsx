"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { Star, CheckCircle2, Trash2, ExternalLink, Filter, X } from "lucide-react";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchLessons = useCallback(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (visibility) params.visibility = visibility;

    api
      .get("/admin/lessons", { params })
      .then((res) => setLessons(res.data.lessons))
      .catch(() => toast.error("Failed to load lessons"))
      .finally(() => setLoading(false));
  }, [category, visibility]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleToggleFeature = async (lesson) => {
    setUpdatingId(lesson._id);
    try {
      const res = await api.patch(`/admin/lessons/${lesson._id}/feature`);
      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? { ...l, isFeatured: res.data.isFeatured } : l))
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to update featured status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkReviewed = async (lesson) => {
    setUpdatingId(lesson._id);
    try {
      await api.patch(`/admin/lessons/${lesson._id}/review`);
      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? { ...l, isReviewed: true } : l))
      );
      toast.success("Marked as reviewed");
    } catch (err) {
      toast.error("Failed to mark as reviewed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/lessons/${deleteTarget._id}`);
      setLessons((prev) => prev.filter((l) => l._id !== deleteTarget._id));
      toast.success("Lesson deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete lesson");
    } finally {
      setDeleting(false);
    }
  };

  const publicCount = lessons.filter((l) => l.visibility === "Public").length;
  const privateCount = lessons.filter((l) => l.visibility === "Private").length;

  const hasFilters = category || visibility;
  const clearFilters = () => {
    setCategory("");
    setVisibility("");
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Lessons</h1>
          <p className="text-gray-400 mt-1">
            {publicCount} public · {privateCount} private
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${filtersOpen || hasFilters
              ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
              : "bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700"
            }`}
        >
          <Filter size={14} />
          Filter
        </button>
      </div>

      {filtersOpen && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="">All</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
          {hasFilters && (
            <div className="sm:col-span-2 flex justify-end">
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                <X size={13} /> Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60">
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Lesson</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Creator</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Visibility</th>
                <th className="text-left px-5 py-4 text-gray-400 font-medium">Status</th>
                <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/lessons/${lesson._id}`}
                      className="font-medium text-white hover:text-violet-400 transition-colors line-clamp-1 max-w-[200px] block"
                    >
                      {lesson.title}
                    </Link>
                    <span className="text-xs text-gray-500">{lesson.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{lesson.creatorName}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${lesson.visibility === "Public" ? "bg-green-500/15 text-green-300" : "bg-gray-700/40 text-gray-400"
                      }`}>
                      {lesson.visibility}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {lesson.isFeatured && (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-500/15 text-amber-300">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      )}
                      {lesson.isReviewed && (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-500/15 text-blue-300">
                          <CheckCircle2 size={10} /> Reviewed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleFeature(lesson)}
                        disabled={updatingId === lesson._id}
                        title={lesson.isFeatured ? "Remove from featured" : "Mark as featured"}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${lesson.isFeatured
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-gray-800 hover:bg-amber-500/20 hover:text-amber-300 text-gray-400"
                          }`}
                      >
                        <Star size={14} fill={lesson.isFeatured ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => handleMarkReviewed(lesson)}
                        disabled={updatingId === lesson._id || lesson.isReviewed}
                        title="Mark as reviewed"
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-600/20 hover:text-blue-300 text-gray-400 flex items-center justify-center transition-colors disabled:opacity-40"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <Link
                        href={`/lessons/${lesson._id}`}
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(lesson)}
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-600/20 hover:text-red-300 text-gray-400 flex items-center justify-center transition-colors"
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

        {lessons.length === 0 && (
          <p className="text-center py-16 text-gray-500 text-sm">No lessons found</p>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this lesson?"
        description={`"${deleteTarget?.title}" will be permanently removed from the platform.`}
      />
    </div>
  );
}
