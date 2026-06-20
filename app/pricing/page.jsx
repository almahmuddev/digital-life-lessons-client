"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Check, X, Crown, Loader2, Star } from "lucide-react";
import PrivateRoute from "@/components/ui/PrivateRoute";

const FEATURES = [
  {
    label: "Number of lessons you can create",
    free: "Unlimited",
    premium: "Unlimited",
  },
  {
    label: "Create Premium-only lessons",
    free: false,
    premium: true,
  },
  {
    label: "Access to Premium content from others",
    free: false,
    premium: true,
  },
  {
    label: "Ad-free experience",
    free: false,
    premium: true,
  },
  {
    label: "Priority listing in Public Lessons",
    free: false,
    premium: true,
  },
  {
    label: "Community badge / verified status",
    free: false,
    premium: true,
  },
  {
    label: "Save lessons to Favorites",
    free: true,
    premium: true,
  },
  {
    label: "Comment & like lessons",
    free: true,
    premium: true,
  },
];

function PricingContent() {
  const { user, isPremium, loading } = useAuth();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in to upgrade");
      router.push("/login");
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await api.post("/payments/create-checkout-session");
      // redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start checkout");
      setCheckoutLoading(false);
    }
  };

  // already premium — show badge instead of pricing table
  if (!loading && isPremium) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Crown size={36} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">
            You're already Premium! ⭐
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            You have lifetime access to all Premium features. Thank you for
            supporting LifeLessons.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            Pricing
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-white mt-4 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Start free, upgrade anytime. One-time payment, lifetime access —
            no subscriptions, no hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">

          {/* Free plan */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-1">Free</h3>
            <p className="text-gray-500 text-sm mb-6">For casual reflection</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">৳0</span>
              <span className="text-gray-500 text-sm"> / forever</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {["Create unlimited free lessons", "Browse public lessons", "Save to favorites", "Comment & like"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full py-3 rounded-xl border border-gray-700 text-gray-500 font-semibold text-sm cursor-not-allowed"
            >
              {user ? "Current Plan" : "Get Started Free"}
            </button>
          </div>

          {/* Premium plan */}
          <div className="relative bg-gradient-to-b from-amber-900/20 to-gray-900 border border-amber-500/30 rounded-2xl p-8 flex flex-col overflow-hidden">
            {/* Popular badge */}
            <span className="absolute top-0 right-0 bg-amber-500 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              LIFETIME
            </span>

            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">Premium</h3>
              <Star size={16} className="text-amber-400" fill="currentColor" />
            </div>
            <p className="text-gray-500 text-sm mb-6">For serious wisdom seekers</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">৳1500</span>
              <span className="text-gray-500 text-sm"> / one-time</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {["Everything in Free", "Create Premium lessons", "Unlock all Premium content", "Ad-free experience", "Priority listing", "Community badge"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-200">
                  <Check size={16} className="text-amber-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-bold text-sm transition-colors"
            >
              {checkoutLoading && <Loader2 size={16} className="animate-spin" />}
              {checkoutLoading ? "Redirecting..." : "Upgrade to Premium"}
            </button>
          </div>
        </div>

        {/* Comparison table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">Compare Plans</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Feature</th>
                  <th className="text-center px-6 py-4 text-gray-400 font-medium w-32">Free</th>
                  <th className="text-center px-6 py-4 text-amber-400 font-medium w-32">Premium</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}>
                    <td className="px-6 py-4 text-gray-300">{row.label}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check size={18} className="text-green-400 mx-auto" />
                        ) : (
                          <X size={18} className="text-gray-700 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-300">{row.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <Check size={18} className="text-amber-400 mx-auto" />
                        ) : (
                          <X size={18} className="text-gray-700 mx-auto" />
                        )
                      ) : (
                        <span className="text-amber-300">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <PrivateRoute>
      <PricingContent />
    </PrivateRoute>
  );
}
