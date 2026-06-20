"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Send, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CommentSection({ lessonId, comments, onCommentAdded }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!user) {
      toast.error("Please log in to comment");
      return;
    }

    setPosting(true);
    try {
      const res = await api.post("/comments", { lessonId, text });
      onCommentAdded(res.data.comment);
      setText("");
      toast.success("Comment posted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={18} className="text-violet-400" />
        <h2 className="text-lg font-bold text-white">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <img
            src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {posting ? (
                <Loader2 size={14} className="text-white animate-spin" />
              ) : (
                <Send size={14} className="text-white" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-800/50 rounded-xl p-4 mb-8 text-center">
          <p className="text-sm text-gray-400">
            <Link href="/login" className="text-violet-400 hover:underline">Log in</Link> to join the conversation
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <img
                src={comment.userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`}
                alt={comment.userName}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="bg-gray-800 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{comment.userName}</span>
                    <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
