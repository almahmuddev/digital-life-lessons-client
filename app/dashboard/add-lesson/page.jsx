"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Loader2, Info, Crown } from "lucide-react";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

const VISIBILITIES = ["Public", "Private"];

export default function AddLessonPage() {
  const { user, isPremium } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    imageURL: "",
    visibility: "Public",
    accessLevel: "Free",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.emotionalTone) newErrors.emotionalTone = "Emotional tone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/lessons", form);
      toast.success("Lesson created successfully! 🎉");
      router.push("/dashboard/my-lessons");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider";
  const inputClass = (field) =>
    `w-full bg-gray-800 border ${
      errors[field] ? "border-red-500" : "border-gray-700"
    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors text-sm`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Add New Lesson</h1>
        <p className="text-gray-400 mt-1">
          Share a life experience, insight, or piece of wisdom
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <label className={labelClass}>Lesson Title *</label>
          <input
            name="title"
            type="text"
            placeholder="What did you learn?"
            value={form.title}
            onChange={handleChange}
            className={inputClass("title")}
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Full Description / Story *</label>
          <textarea
            name="description"
            rows={6}
            placeholder="Tell your story in detail. What happened? What did you learn? How did it change you?"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass("description")} resize-none`}
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Category + Tone — 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputClass("category")} cursor-pointer`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Emotional Tone *</label>
            <select
              name="emotionalTone"
              value={form.emotionalTone}
              onChange={handleChange}
              className={`${inputClass("emotionalTone")} cursor-pointer`}
            >
              <option value="">Select tone</option>
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.emotionalTone && (
              <p className="text-red-400 text-xs mt-1">{errors.emotionalTone}</p>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className={labelClass}>
            Image URL <span className="text-gray-600 normal-case">(optional)</span>
          </label>
          <input
            name="imageURL"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageURL}
            onChange={handleChange}
            className={inputClass("imageURL")}
          />
        </div>

        {/* Visibility + Access Level — 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Visibility</label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className={`${inputClass("visibility")} cursor-pointer`}
            >
              {VISIBILITIES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Access Level</label>
            <div className="relative">
              <select
                name="accessLevel"
                value={form.accessLevel}
                onChange={handleChange}
                disabled={!isPremium}
                className={`${inputClass("accessLevel")} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="Free">Free</option>
                {isPremium && <option value="Premium">Premium</option>}
              </select>
            </div>
            {/* Tooltip for free users */}
            {!isPremium && (
              <p className="flex items-center gap-1.5 text-xs text-amber-400 mt-1.5">
                <Info size={12} />
                Upgrade to Premium to create paid lessons
              </p>
            )}
          </div>
        </div>

        {/* Premium upsell banner for free users */}
        {!isPremium && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <Crown size={20} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                Want to create Premium lessons?
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Upgrade to Premium and earn from exclusive content.{" "}
                <a href="/pricing" className="text-amber-400 hover:underline">
                  See pricing →
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Publishing..." : "Publish Lesson"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
EOF