import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function AuthorCard({ creatorId, creatorName, creatorPhoto, totalLessons }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        About the Author
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={creatorPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${creatorName}`}
          alt={creatorName}
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
        />
        <div>
          <p className="font-semibold text-white">{creatorName}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <BookOpen size={11} />
            {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} shared
          </p>
        </div>
      </div>

      <Link
        href={`/profile/${creatorId}`}
        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-violet-500 text-sm font-medium transition-colors"
      >
        View all lessons by this author
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
