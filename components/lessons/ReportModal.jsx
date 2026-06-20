"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Flag, X, Loader2 } from "lucide-react";

const REASONS = [
  "Inappropriate content",
  "Spam or misleading",
  "Hate speech",
  "Harassment",
  "False information",
  "Other",
];

export default function ReportModal({ lessonId, isOpen, onClose }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post("/reports", { lessonId, reason });
      toast.success("Lesson reported. Thank you for keeping our community safe.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Flag size={16} className="text-red-400" />
            </div>
            <h2 className="text-base font-bold text-white">Report Lesson</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Help us understand the issue. Our team will review this report.
        </p>

        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-6 focus:outline-none focus:border-red-500 cursor-pointer"
        >
          {REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
