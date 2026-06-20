"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateUser } = useAuth();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("checking"); // checking | success | failed

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    api
      .get(`/payments/verify-session/${sessionId}`)
      .then((res) => {
        if (res.data.paid) {
          setStatus("success");
          // reflect premium status immediately in UI
          updateUser({ isPremium: true });
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {status === "checking" && (
          <>
            <Loader2 size={48} className="text-violet-400 animate-spin mx-auto mb-6" />
            <h1 className="text-xl font-bold text-white mb-2">
              Confirming your payment...
            </h1>
            <p className="text-gray-400 text-sm">This will only take a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-gray-400 mb-8">
              Welcome to Premium. You now have lifetime access to all premium
              features and exclusive lessons.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle size={36} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">
              Couldn't verify payment
            </h1>
            <p className="text-gray-400 mb-8">
              We couldn't confirm your payment. If you were charged, please
              contact support — otherwise, try again.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Back to Pricing
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 size={48} className="text-violet-400 animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
