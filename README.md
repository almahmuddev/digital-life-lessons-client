# LifeLessons — Digital Life Lessons Platform

A full-stack web platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time.

## 🌐 Live URL

- **Client:** https://digital-life-lessons-client-beta.vercel.app/
- **Server:** https://digital-life-lessons-server.onrender.com

## 🎯 Purpose

People often learn valuable lessons but forget them over time. LifeLessons helps preserve personal wisdom, encourages mindful reflection, and allows users to grow by exploring lessons from the community.

## ✨ Key Features

- **Auth System** — Register/login with email & password or Google OAuth. JWT-based, reload-safe sessions.
- **Free & Premium Plans** — One-time ৳1500 Stripe payment unlocks Premium lifetime access.
- **Create Life Lessons** — Title, description, category, emotional tone, image, visibility, and access level.
- **Browse Public Lessons** — Filter by category and tone, sort by newest or most saved, keyword search, 9-per-page pagination.
- **Lesson Details** — Like, save to favorites, comment, report, share, similar lessons section.
- **Premium Content Lock** — Premium lessons blurred for Free users with upgrade prompt.
- **Admin Dashboard** — Feature lessons, manage users and roles, review reported content, platform analytics with charts.
- **My Lessons Table** — Toggle visibility and access level, update, delete with confirmation.
- **My Favorites** — Save, filter, and remove favorite lessons.
- **Author Profiles** — Public profile page for every lesson creator.
- **Framer Motion Animations** — Staggered card animations on home page.
- **Dark/Light Theme Toggle** — Full theme switching with next-themes.

## 🛠️ npm Packages Used

| Package | Purpose |
|---|---|
| `next` | React framework with App Router |
| `axios` | HTTP requests to backend API |
| `react-hot-toast` | Toast notifications |
| `framer-motion` | Page and section animations |
| `swiper` | Hero slider carousel |
| `@react-oauth/google` | Google OAuth login |
| `recharts` | Admin dashboard line chart |
| `lucide-react` | Icon library |
| `next-themes` | Dark/light theme toggle |
| `tailwindcss` | Utility-first CSS |

## 🚀 Run Locally

```bash
npm install
# create .env.local — see .env.local.example
npm run dev
```

## 📋 Environment Variables

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```
