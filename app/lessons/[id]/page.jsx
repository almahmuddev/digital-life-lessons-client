"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/ui/PrivateRoute";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LessonCard from "@/components/lessons/LessonCard";
import CommentSection from "@/components/lessons/CommentSection";
import ReportModal from "@/components/lessons/ReportModal";
import AuthorCard from "@/components/lessons/AuthorCard";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Bookmark,
  Flag,
  Share2,
  Lock,
  Crown,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

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

function LessonDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isPremium } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [premiumLocked, setPremiumLocked] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [savesCount, setSavesCount] = useState(0);
  const [viewsCount] = useState(() => Math.floor(Math.random() * 10000));

  const [comments, setComments] = useState([]);
  const [similarLessons, setSimilarLessons] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);

  // ── Fetch lesson + related data ──────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api
      .get(`/lessons/${id}`)
      .then((res) => {
        const l = res.data.lesson;
        setLesson(l);
        setLikesCount(l.likesCount || 0);
        setSavesCount(l.favoritesCount || 0);
        setLiked(user ? l.likes.includes(user._id) : false);
        setPremiumLocked(false);

        // fetch comments
        api.get(`/comments/${id}`).then((r) => setComments(r.data.comments));

        // fetch similar lessons (same category)
        api.get("/lessons/public", { params: { category: l.category, limit: 6 } })
          .then((r) => setSimilarLessons(r.data.lessons.filter((sl) => sl._id !== id)));

        // check if saved
        if (user) {
          api.get(`/favorites/check/${id}`).then((r) => setSaved(r.data.isSaved));
        }
      })
      .catch((err) => {
        if (err.response?.data?.isPremiumRequired) {
          setPremiumLocked(true);
        } else {
          toast.error("Lesson not found");
          router.push("/public-lessons");
        }
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  // ── Like toggle ───────────────────────────────────────────────────────────
  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like");
      return;
    }
    // optimistic update
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await api.patch(`/lessons/${id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      // rollback on failure
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like");
    }
  };

  // ── Save to favorites toggle ────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) {
      toast.error("Please log in to save lessons");
      return;
    }

    const prevSaved = saved;
    const prevCount = savesCount;
    setSaved(!saved);
    setSavesCount(saved ? savesCount - 1 : savesCount + 1);

    try {
      if (prevSaved) {
        await api.delete(`/favorites/${id}`);
        toast.success("Removed from favorites");
      } else {
        await api.post("/favorites", { lessonId: id });
        toast.success("Saved to favorites");
      }
    } catch (err) {
      setSaved(prevSaved);
      setSavesCount(prevCount);
      toast.error(err.response?.data?.message || "Failed to update favorites");
    }
  };

  // ── Share ────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: lesson.title, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  // ── Reading time estimate ───────────────────────────────────────────────
  const readingTime = lesson
    ? Math.max(1, Math.ceil(lesson.description.split(" ").length / 200))
    : 1;

  if (loading) return <LoadingSpinner fullPage />;

  // ── Premium locked view ─────────────────────────────────────────────────
  if (premiumLocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Premium Lesson</h1>
          <p className="text-gray-400 mb-8">
            This lesson is exclusive to Premium members. Upgrade to unlock this
            and all other Premium content.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Crown size={16} />
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  const formattedCreated = new Date(lesson.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const formattedUpdated = new Date(lesson.updatedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          href="/public-lessons"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Public Lessons
        </Link>

        {/* ── 1. Lesson Information ── */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[lesson.category]}`}>
              {lesson.category}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TONE_COLORS[lesson.emotionalTone]}`}>
              {lesson.emotionalTone}
            </span>
            {lesson.accessLevel === "Premium" && (
              <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                <Crown size={10} /> Premium
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-6">
            {lesson.title}
          </h1>

          {lesson.imageURL && (
            <img
              src={lesson.imageURL}
              alt={lesson.title}
              className="w-full h-72 sm:h-96 object-cover rounded-2xl mb-6"
            />
          )}

          <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
            {lesson.description}
          </p>
        </div>

        {/* ── 2. Lesson Metadata ── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 mb-8 pb-8 border-b border-gray-800">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> Created {formattedCreated}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> Updated {formattedUpdated}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={13} /> {lesson.visibility}
          </span>
          <span className="flex items-center gap-1.5">
            📖 {readingTime} min read
          </span>
        </div>

        {/* ── 3. Author Card ── */}
        <div className="mb-8">
          <AuthorCard
            creatorId={lesson.creatorId}
            creatorName={lesson.creatorName}
            creatorPhoto={lesson.creatorPhoto}
            totalLessons={1}
          />
        </div>

        {/* ── 4. Stats & 5. Interaction Buttons ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-6 mb-5 pb-5 border-b border-gray-800">
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Heart size={16} className="text-rose-400" />
              {likesCount.toLocaleString()} Likes
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Bookmark size={16} className="text-violet-400" />
              {savesCount.toLocaleString()} Favorites
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Eye size={16} className="text-blue-400" />
              {viewsCount.toLocaleString()} Views
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                liked
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-rose-500/40"
              }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              {liked ? "Liked" : "Like"}
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                saved
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-violet-500/40"
              }`}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save to Favorites"}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-500/40 transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>

            {user && (
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-500/40 hover:text-red-300 transition-colors ml-auto"
              >
                <Flag size={14} />
                Report
              </button>
            )}
          </div>
        </div>

        {/* ── 6. Comment Section ── */}
        <div className="mb-10">
          <CommentSection
            lessonId={id}
            comments={comments}
            onCommentAdded={(c) => setComments([c, ...comments])}
          />
        </div>

        {/* ── 7. Similar & Recommended Lessons ── */}
        {similarLessons.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-5">
              Similar Lessons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarLessons.slice(0, 6).map((sl) => (
                <LessonCard key={sl._id} lesson={sl} isCurrentUserPremium={isPremium} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ReportModal
        lessonId={id}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}

export default function LessonDetailsPage() {
  return (
    <PrivateRoute>
      <LessonDetailsContent />
    </PrivateRoute>
  );
}
