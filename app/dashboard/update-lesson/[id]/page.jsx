"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Loader2, Info, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];
const VISIBILITIES = ["Public", "Private"];

export default function UpdateLessonPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isPremium } = useAuth();

  const [form, setForm] = useState(null); // null until loaded
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notOwner, setNotOwner] = useState(false);

  // ── Load existing lesson ───────────────────────────────────────────────────
  useEffect(() => {
    if (!id || !user) return;

    api
      .get(`/lessons/${id}`)
      .then((res) => {
        const l = res.data.lesson;

        // guard: only the owner (or admin) can edit
        if (l.creatorId !== user._id && user.role !== "admin") {
          setNotOwner(true);
          return;
        }

        setForm({
          title: l.title,
          description: l.description,
          category: l.category,
          emotionalTone: l.emotionalTone,
          imageURL: l.imageURL || "",
          visibility: l.visibility,
          accessLevel: l.accessLevel,
        });
      })
      .catch(() => {
        toast.error("Lesson not found");
        router.push("/dashboard/my-lessons");
      })
      .finally(() => setLoading(false));
  }, [id, user]);

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

    setSaving(true);
    try {
      await api.patch(`/lessons/${id}`, form);
      toast.success("Lesson updated successfully");
      router.push("/dashboard/my-lessons");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update lesson");
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider";
  const inputClass = (field) =>
    `w-full bg-gray-800 border ${
      errors[field] ? "border-red-500" : "border-gray-700"
    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors text-sm`;

  if (loading) return <LoadingSpinner fullPage />;

  if (notOwner) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">You don't have permission to edit this lesson.</p>
        <Link href="/dashboard/my-lessons" className="text-violet-400 hover:underline text-sm">
          ← Back to My Lessons
        </Link>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/my-lessons"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to My Lessons
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Update Lesson</h1>
        <p className="text-gray-400 mt-1">Edit your lesson details below</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <label className={labelClass}>Lesson Title *</label>
          <input
            name="title"
            type="text"
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
            value={form.description}
            onChange={handleChange}
            className={`${inputClass("description")} resize-none`}
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Category + Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputClass("category")} cursor-pointer`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className={labelClass}>Emotional Tone *</label>
            <select
              name="emotionalTone"
              value={form.emotionalTone}
              onChange={handleChange}
              className={`${inputClass("emotionalTone")} cursor-pointer`}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.emotionalTone && (
              <p className="text-red-400 text-xs mt-1">{errors.emotionalTone}</p>
            )}
          </div>
        </div>

        {/* Image URL — re-upload optional */}
        <div>
          <label className={labelClass}>
            Image URL <span className="text-gray-600 normal-case">(optional — leave blank to remove image)</span>
          </label>
          <input
            name="imageURL"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageURL}
            onChange={handleChange}
            className={inputClass("imageURL")}
          />
          {form.imageURL && (
            <img
              src={form.imageURL}
              alt="Preview"
              className="mt-3 w-full h-40 object-cover rounded-xl border border-gray-700"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>

        {/* Visibility + Access Level */}
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
            {!isPremium && (
              <p className="flex items-center gap-1.5 text-xs text-amber-400 mt-1.5">
                <Info size={12} />
                Upgrade to Premium to enable Premium access
              </p>
            )}
          </div>
        </div>

        {!isPremium && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <Crown size={20} className="text-amber-400 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              Only Premium members can switch a lesson's access level to Premium.{" "}
              <a href="/pricing" className="text-amber-400 hover:underline">See pricing →</a>
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/my-lessons")}
            className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
