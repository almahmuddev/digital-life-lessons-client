"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import LessonCard from "@/components/lessons/LessonCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Star } from "lucide-react";

export default function FeaturedLessons() {
  const { isPremium } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/lessons/featured")
      .then((res) => setLessons(res.data.lessons))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  if (!lessons.length) return null;

  return (
    <section className="py-20 px-4 bg-gray-900/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              Featured
            </span>
            <h2 className="text-3xl font-black text-white mt-3">
              Featured Life Lessons
            </h2>
            <p className="text-gray-400 mt-2">
              Hand-picked by our team — wisdom worth exploring
            </p>
          </div>
          <Link
            href="/public-lessons"
            className="hidden sm:flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              isCurrentUserPremium={isPremium}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
