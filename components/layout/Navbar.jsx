"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Star,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isPremium } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const isActive = (href) => pathname === href;

  const navLinkClass = (href) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive(href)
        ? "text-violet-500"
        : "text-gray-300 hover:text-violet-400"
    }`;

  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/public-lessons", label: "Public Lessons" },
  ];

  const privateNavLinks = [
    { href: "/dashboard/add-lesson", label: "Add Lesson" },
    { href: "/dashboard/my-lessons", label: "My Lessons" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">
              Life<span className="text-violet-400">Lessons</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-6">
            {publicNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                {privateNavLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
                    {link.label}
                  </Link>
                ))}

                {/* Pricing — only for free users */}
                {!isPremium && (
                  <Link href="/pricing" className={navLinkClass("/pricing")}>
                    Pricing
                  </Link>
                )}
              </>
            )}

            {!user && (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-300 hover:text-violet-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* ── Right side: Premium badge + Avatar dropdown ── */}
          <div className="hidden md:flex items-center gap-3">
            {user && isPremium && (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                <Star size={12} fill="currentColor" />
                Premium
              </span>
            )}

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-700 group-hover:border-violet-500 transition-colors"
                  />
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                    {/* user info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* dropdown links */}
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <User size={15} />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile menu button ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col gap-4">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={navLinkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <>
              {privateNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              {!isPremium && (
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass("/pricing")}
                >
                  Pricing
                </Link>
              )}
              <hr className="border-gray-700" />
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-gray-700"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <User size={15} /> Profile
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 text-left"
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          )}

          {!user && (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-gray-300 hover:text-violet-400"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium bg-violet-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
