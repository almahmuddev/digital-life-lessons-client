"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LessonCard from "@/components/lessons/LessonCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-saved", label: "Most Saved" },
  { value: "most-liked", label: "Most Liked" },
];

export default function PublicLessonsPage() {
  const { isPremium } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // filter state
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [emotionalTone, setEmotionalTone] = useState("");
  const [sort, setSort] = useState("newest");

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLessons = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 9, sort };
    if (category) params.category = category;
    if (emotionalTone) params.emotionalTone = emotionalTone;
    if (search) params.search = search;

    api
      .get("/lessons/public", { params })
      .then((res) => {
        setLessons(res.data.lessons);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, sort, category, emotionalTone, search]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleToneChange = (val) => {
    setEmotionalTone(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
  };

  const clearFilters = () => {
    setCategory("");
    setEmotionalTone("");
    setSearchInput("");
    setSearch("");
    setSort("newest");
    setPage(1);
  };

  const hasActiveFilters = category || emotionalTone || search;

  return (
    <div className="px-4 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Public Life Lessons</h1>
          <p className="text-gray-400">
            Explore wisdom shared by our community — {total} lesson{total !== 1 ? "s" : ""} and counting
          </p>
        </div>

        {/* Search + Filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title or keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
            />
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${
              filtersOpen || hasActiveFilters
                ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                : "bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700"
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            )}
          </button>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
                onChange={(e) => handleToneChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="">All Tones</option>
                {TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div className="sm:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <X size={13} />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && !filtersOpen && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {category && (
              <span className="flex items-center gap-1.5 text-xs bg-violet-600/20 text-violet-300 px-3 py-1.5 rounded-full">
                {category}
                <button onClick={() => handleCategoryChange("")}><X size={12} /></button>
              </span>
            )}
            {emotionalTone && (
              <span className="flex items-center gap-1.5 text-xs bg-violet-600/20 text-violet-300 px-3 py-1.5 rounded-full">
                {emotionalTone}
                <button onClick={() => handleToneChange("")}><X size={12} /></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1.5 text-xs bg-violet-600/20 text-violet-300 px-3 py-1.5 rounded-full">
                "{search}"
                <button onClick={() => setSearchInput("")}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500 mb-1">No lessons found</p>
            <p className="text-gray-600 text-sm">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson._id}
                  lesson={lesson}
                  isCurrentUserPremium={isPremium}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
                >
                  <ChevronLeft size={15} />
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-violet-600 text-white"
                          : "text-gray-400 hover:bg-gray-800"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
