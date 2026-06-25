"use client";

import PrivateRoute from "@/components/ui/PrivateRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  BookMarked,
  Heart,
  User,
  Users,
  BookOpen,
  Flag,
  ChevronRight,
} from "lucide-react";

const userLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/add-lesson", label: "Add Lesson", icon: PlusCircle },
  { href: "/dashboard/my-lessons", label: "My Lessons", icon: BookMarked },
  { href: "/dashboard/my-favorites", label: "My Favorites", icon: Heart },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Admin Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/manage-users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/manage-lessons", label: "Manage Lessons", icon: BookOpen },
  { href: "/dashboard/admin/reported-lessons", label: "Reported Lessons", icon: Flag },
  { href: "/dashboard/admin/profile", label: "Admin Profile", icon: User },
];

function Sidebar() {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks;

  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-3">
      {/* User info */}
      <div className="flex items-center gap-3 px-3 mb-6">
        <img
          src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-violet-500"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{isAdmin ? "Admin" : user?.isPremium ? "Premium" : "Free"}</p>
        </div>
      </div>

      <hr className="border-gray-800 mb-4" />

      {/* User links */}
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">
        My Space
      </p>
      <nav className="flex flex-col gap-1 mb-6">
        {userLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(href)
              ? "bg-violet-600/20 text-violet-400"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
          >
            <Icon size={16} />
            {label}
            {isActive(href) && <ChevronRight size={14} className="ml-auto text-violet-400" />}
          </Link>
        ))}
      </nav>

      {/* Admin links */}
      {isAdmin && (
        <>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-2">
            Admin Panel
          </p>
          <nav className="flex flex-col gap-1">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(href)
                  ? "bg-violet-600/20 text-violet-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <Icon size={16} />
                {label}
                {isActive(href) && <ChevronRight size={14} className="ml-auto text-violet-400" />}
              </Link>
            ))}
          </nav>
        </>
      )}
    </aside>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <PrivateRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </PrivateRoute>
  );
}
