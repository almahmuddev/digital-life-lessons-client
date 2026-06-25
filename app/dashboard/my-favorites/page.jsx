"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Heart,
  Bookmark,
  ExternalLink,
  X,
  Crown,
  Filter,
} from "lucide-react";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function MyFavoritesPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [category, setCategory] = useState("");
  const [emotionalTone, setEmotionalTone] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchFavorites = useCallback(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (emotionalTone) params.emotionalTone = emotionalTone;

    api
      .get("/favorites/my", { params })
      .then((res) => setLessons(res.data.lessons))
      .catch(() => toast.error("Failed to load favorites"))
      .finally(() => setLoading(false));
  }, [category, emotionalTone]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = async (lessonId) => {
    setRemovingId(lessonId);
    try {
      await api.delete(`/favorites/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Failed to remove favorite");
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const hasActiveFilters = category || emotionalTone;

  const clearFilters = () => {
    setCategory("");
    setEmotionalTone("");
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">My Favorites</h1>
          <p className="text-gray-400 mt-1">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${filtersOpen || hasActiveFilters
            ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
            : "bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700"
            }`}
        >
          <Filter size={14} />
          Filter
          {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
        </button>
      </div>

      {/* Filter panel */}
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
              Emotional Tone
            </label>
            <select
              value={emotionalTone}
              onChange={(e) => setEmotionalTone(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="">All Tones</option>
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <X size={13} />
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      {lessons.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
          <Heart size={36} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No favorites saved yet</p>
          <Link
            href="/public-lessons"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Browse Public Lessons
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/60">
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Lesson</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Category</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Tone</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Creator</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Saved</th>
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
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/lessons/${lesson._id}`}
                          className="font-medium text-white hover:text-violet-400 transition-colors line-clamp-1 max-w-[200px]"
                        >
                          {lesson.title}
                        </Link>
                        {lesson.accessLevel === "Premium" && (
                          <Crown size={12} className="text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{lesson.category}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{lesson.emotionalTone}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={lesson.creatorPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${lesson.creatorName}`}
                          alt={lesson.creatorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-gray-400 text-xs truncate max-w-[100px]">
                          {lesson.creatorName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {formatDate(lesson.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/lessons/${lesson._id}`}
                          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-violet-600/20 hover:text-violet-300 text-gray-400 flex items-center justify-center transition-colors"
                          title="View details"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => handleRemove(lesson._id)}
                          disabled={removingId === lesson._id}
                          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-red-600/20 hover:text-red-300 text-gray-400 flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Remove from favorites"
                        >
                          <X size={14} />
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
    </div>
  );
}
