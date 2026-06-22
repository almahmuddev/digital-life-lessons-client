"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Users,
  BookOpen,
  Flag,
  Crown,
  Globe,
  Lock,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (!stats) return null;

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Public Lessons",
      value: stats.totalPublicLessons,
      icon: Globe,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Private Lessons",
      value: stats.totalPrivateLessons,
      icon: Lock,
      color: "text-gray-400",
      bg: "bg-gray-500/10",
    },
    {
      label: "Reported Lessons",
      value: stats.totalReportedLessons,
      icon: Flag,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Premium Members",
      value: stats.premiumUsers,
      icon: Crown,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "New Lessons Today",
      value: stats.todayLessons,
      icon: TrendingUp,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  // format growth data for chart
  const chartData = stats.lessonGrowth.map((d) => ({
    date: new Date(d._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    lessons: d.count,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Admin Overview</h1>
        <p className="text-gray-400 mt-1">Platform-wide analytics and activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-2xl font-black text-white leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Growth chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-1">Lesson Growth</h2>
        <p className="text-xs text-gray-500 mb-6">Lessons created over the last 7 days</p>

        {chartData.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-12">
            No lesson activity in the last 7 days yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#f3f4f6" }}
              />
              <Line
                type="monotone"
                dataKey="lessons"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ fill: "#8b5cf6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
