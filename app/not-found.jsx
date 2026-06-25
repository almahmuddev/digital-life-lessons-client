import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      {/* showing number */}
      <div className="relative mb-6">
        <p className="text-[10rem] font-black text-gray-800 leading-none select-none">
          404
        </p>
        <p className="absolute inset-0 text-[10rem] font-black leading-none select-none text-violet-500 opacity-20 blur-2xl">
          404
        </p>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-gray-400 max-w-sm mb-8">
        The page you are looking for might have been moved, deleted, or perhaps
        never existed.
      </p>

      <Link
        href="/"
        className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
