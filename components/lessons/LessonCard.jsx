import Link from "next/link";
import { Calendar, Heart, Bookmark, Lock, Crown } from "lucide-react";

const CATEGORY_COLORS = {
  "Personal Growth": "bg-violet-500/20 text-violet-300",
  Career: "bg-blue-500/20 text-blue-300",
  Relationships: "bg-pink-500/20 text-pink-300",
  Mindset: "bg-amber-500/20 text-amber-300",
  "Mistakes Learned": "bg-red-500/20 text-red-300",
};

const TONE_COLORS = {
  Motivational: "bg-green-500/20 text-green-300",
  Sad: "bg-indigo-500/20 text-indigo-300",
  Realization: "bg-orange-500/20 text-orange-300",
  Gratitude: "bg-teal-500/20 text-teal-300",
};

export default function LessonCard({ lesson, isCurrentUserPremium = false }) {
  const isPremiumLocked =
    lesson.accessLevel === "Premium" && !isCurrentUserPremium;

  const formattedDate = new Date(lesson.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full group hover:border-violet-500/50 transition-colors duration-300">

      {/* Premium blur overlay */}
      {isPremiumLocked && (
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-gray-950/60 flex flex-col items-center justify-center gap-3 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Lock size={22} className="text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-white">Premium Lesson</p>
          <p className="text-xs text-gray-400 text-center px-6">
            Upgrade to Premium to unlock this lesson
          </p>
          <Link
            href="/pricing"
            className="mt-1 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-xs px-4 py-2 rounded-full transition-colors"
          >
            <Crown size={12} />
            Upgrade to Premium
          </Link>
        </div>
      )}

      {/* Lesson image */}
      {lesson.imageURL && (
        <div className="h-44 overflow-hidden flex-shrink-0">
          <img
            src={lesson.imageURL}
            alt={lesson.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[lesson.category] || "bg-gray-700 text-gray-300"}`}>
            {lesson.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TONE_COLORS[lesson.emotionalTone] || "bg-gray-700 text-gray-300"}`}>
            {lesson.emotionalTone}
          </span>
          {lesson.accessLevel === "Premium" && (
            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
              <Crown size={10} />
              Premium
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {lesson.description}
        </p>

        {/* Creator info */}
        <div className="flex items-center gap-2 mb-4">
          <img
            src={lesson.creatorPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${lesson.creatorName}`}
            alt={lesson.creatorName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-gray-500 truncate">{lesson.creatorName}</span>
          <span className="text-gray-700 text-xs ml-auto flex items-center gap-1">
            <Calendar size={11} />
            {formattedDate}
          </span>
        </div>

        {/* Stats + cta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Heart size={12} className="text-rose-400" />
              {lesson.likesCount || 0}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Bookmark size={12} className="text-violet-400" />
              {lesson.favoritesCount || 0}
            </span>
          </div>

          <Link
            href={`/lessons/${lesson._id}`}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            See Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
