import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-6">
          <XCircle size={36} className="text-gray-500" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">
          Payment Canceled
        </h1>
        <p className="text-gray-400 mb-8">
          No worries — your payment was canceled and you haven't been charged.
          You can upgrade to Premium anytime.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/pricing"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="border border-gray-700 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
