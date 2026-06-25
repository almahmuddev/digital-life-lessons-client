"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import LessonCard from "@/components/lessons/LessonCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Bookmark } from "lucide-react";

// Top Contributors ----
export function TopContributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/lessons/top-contributors")
      .then((res) => setContributors(res.data.contributors))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            This Week
          </span>
          <h2 className="text-3xl font-black text-white mt-3">
            Top Contributors
          </h2>
          <p className="text-gray-400 mt-2">
            Members who shared the most wisdom this week
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : contributors.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No contributors yet this week. Be the first!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {contributors.map((c, index) => (
              <div
                key={c._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:border-teal-500/40 transition-colors"
              >
                {/* Rank badge */}
                <div className="relative">
                  <img
                    src={c.creatorPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${c.creatorName}`}
                    alt={c.creatorName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
                  />
                  {index < 3 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${index === 0 ? "bg-amber-500 text-gray-900"
                        : index === 1 ? "bg-gray-400 text-gray-900"
                          : "bg-amber-700 text-white"
                      }`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white line-clamp-1">
                    {c.creatorName}
                  </p>
                  <p className="text-xs text-teal-400 mt-0.5 flex items-center justify-center gap-1">
                    <Trophy size={10} />
                    {c.lessonCount} lesson{c.lessonCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Most Saved Lessons ---
export function MostSavedLessons() {
  const { isPremium } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/lessons/most-saved")
      .then((res) => setLessons(res.data.lessons))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 bg-gray-900/40">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/20">
            Most Popular
          </span>
          <h2 className="text-3xl font-black text-white mt-3">
            Most Saved Lessons
          </h2>
          <p className="text-gray-400 mt-2">
            Lessons the community keeps coming back to
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No lessons saved yet. Start exploring!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson._id}
                lesson={lesson}
                isCurrentUserPremium={isPremium}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
