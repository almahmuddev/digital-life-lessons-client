"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Flag, X, Trash2, ShieldOff, ExternalLink, Loader2 } from "lucide-react";

function ReportsModal({ report, isOpen, onClose, onDelete, onIgnore, actionLoading }) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">{report.lessonTitle}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {report.reportCount} report{report.reportCount !== 1 ? "s" : ""} filed
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {report.reports.map((r, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-red-300 bg-red-500/15 px-2.5 py-1 rounded-full">
                  {r.reason}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Reported lesson owner: <span className="text-gray-400">{r.reportedUserEmail}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link
            href={`/lessons/${report._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            <ExternalLink size={14} />
            View Lesson
          </Link>
          <button
            onClick={() => onIgnore(report._id)}
            disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldOff size={14} />}
            Ignore
          </button>
          <button
            onClick={() => onDelete(report._id)}
            disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReportedLessonsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = () => {
    setLoading(true);
    api
      .get("/reports")
      .then((res) => setReports(res.data.reports))
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (lessonId) => {
    setActionLoading(true);
    try {
      await api.delete(`/admin/lessons/${lessonId}`);
      setReports((prev) => prev.filter((r) => r._id !== lessonId));
      toast.success("Lesson deleted permanently");
      setSelected(null);
    } catch (err) {
      toast.error("Failed to delete lesson");
    } finally {
      setActionLoading(false);
    }
  };

  const handleIgnore = async (lessonId) => {
    setActionLoading(true);
    try {
      await api.delete(`/reports/ignore/${lessonId}`);
      setReports((prev) => prev.filter((r) => r._id !== lessonId));
      toast.success("Reports cleared, lesson stays live");
      setSelected(null);
    } catch (err) {
      toast.error("Failed to ignore reports");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Reported Lessons</h1>
        <p className="text-gray-400 mt-1">
          {reports.length} lesson{reports.length !== 1 ? "s" : ""} flagged for review
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
          <Flag size={36} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No reported lessons. All clear! 🎉</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/60">
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Lesson</th>
                  <th className="text-left px-5 py-4 text-gray-400 font-medium">Report Count</th>
                  <th className="text-right px-5 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-white line-clamp-1 max-w-[300px]">
                      {r.lessonTitle}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 w-fit text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-300">
                        <Flag size={11} />
                        {r.reportCount} report{r.reportCount !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(r)}
                        className="text-xs font-medium px-4 py-2 rounded-lg bg-gray-800 hover:bg-violet-600/20 hover:text-violet-300 text-gray-300 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ReportsModal
        report={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        onDelete={handleDelete}
        onIgnore={handleIgnore}
        actionLoading={actionLoading}
      />
    </div>
  );
}
