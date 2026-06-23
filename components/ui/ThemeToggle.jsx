"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-xl bg-gray-800 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700 border border-gray-700 flex items-center justify-center transition-colors"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={16} className="text-amber-400" />
      ) : (
        <Moon size={16} className="text-violet-400" />
      )}
    </button>
  );
}
