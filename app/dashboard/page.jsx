"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";
import { BookMarked, Heart, PlusCircle, ArrowRight, Crown, TrendingUp } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LessonCard from "@/components/lessons/LessonCard";

export default function DashboardPage() {
  const { user, isPremium } = useAuth();
  const [myLessons, setMyLessons] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/lessons/my"),
      api.get("/favorites/my"),
    ])
      .then(([lessonsRes, favsRes]) => {
        setMyLessons(lessonsRes.data.lessons);
        setMyFavorites(favsRes.data.lessons);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const recentLessons = myLessons.slice(0, 3);

  const stats = [
    {
      label: "Lessons Created",
      value: myLessons.length,
      icon: BookMarked,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      href: "/dashboard/my-lessons",
    },
    {
      label: "Lessons Saved",
      value: myFavorites.length,
      icon: Heart,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      href: "/dashboard/my-favorites",
    },
    {
      label: "Total Likes",
      value: myLessons.reduce((sum, l) => sum + (l.likesCount || 0), 0),
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/dashboard/my-lessons",
    },
  ];

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your lessons</p>
        </div>
        <Link
          href="/dashboard/add-lesson"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <PlusCircle size={16} />
          New Lesson
        </Link>
      </div>

      {/* Premium upsell */}
      {!isPremium && (
        <div className="mb-8 flex items-center gap-4 bg-gradient-to-r from-amber-900/30 to-amber-800/10 border border-amber-500/20 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Crown size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Upgrade to Premium</p>
            <p className="text-xs text-gray-400">
              Create premium lessons, unlock exclusive content, and earn a community badge.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            Upgrade ৳1500
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 flex items-center gap-4 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon size={22} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent lessons */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Recently Added</h2>
          <Link
            href="/dashboard/my-lessons"
            className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentLessons.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
            <BookMarked size={40} className="text-gray-700 mx-auto mb-3" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} isCurrentUserPremium={isPremium} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
