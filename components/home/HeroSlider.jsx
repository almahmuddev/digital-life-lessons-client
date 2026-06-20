"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Sparkles } from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "Share Your Story",
    title: "Your Life Lessons\nDeserve to Be Remembered",
    description:
      "Capture the wisdom you've earned through experience. Create private reflections or share publicly to inspire others on their journey.",
    cta: { label: "Start Writing", href: "/register" },
    secondaryCta: { label: "Browse Lessons", href: "/public-lessons" },
    icon: BookOpen,
    gradient: "from-violet-900/80 via-gray-950/90 to-gray-950",
    accentColor: "text-violet-400",
    iconBg: "bg-violet-600",
  },
  {
    id: 2,
    badge: "Community Wisdom",
    title: "Learn From Thousands\nof Real Experiences",
    description:
      "Browse public life lessons from our growing community. Filter by category, emotional tone, and discover insights that resonate with your own journey.",
    cta: { label: "Explore Lessons", href: "/public-lessons" },
    secondaryCta: { label: "Join Free", href: "/register" },
    icon: Users,
    gradient: "from-blue-900/80 via-gray-950/90 to-gray-950",
    accentColor: "text-blue-400",
    iconBg: "bg-blue-600",
  },
  {
    id: 3,
    badge: "Go Premium",
    title: "Unlock Exclusive Insights\nWith Premium Access",
    description:
      "Premium members can create and access exclusive lessons, earn community badges, and enjoy an ad-free experience with priority listings.",
    cta: { label: "See Pricing", href: "/pricing" },
    secondaryCta: { label: "Learn More", href: "/public-lessons" },
    icon: Sparkles,
    gradient: "from-amber-900/60 via-gray-950/90 to-gray-950",
    accentColor: "text-amber-400",
    iconBg: "bg-amber-600",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={slide.id}>
              <div
                className={`relative min-h-[600px] flex items-center bg-gradient-to-r ${slide.gradient} px-6`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white blur-3xl" />
                  <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
                  {/* Text */}
                  <div>
                    <span className={`inline-block text-xs font-bold uppercase tracking-widest ${slide.accentColor} mb-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/10`}>
                      {slide.badge}
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5 whitespace-pre-line">
                      {slide.title}
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={slide.cta.href}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                      >
                        {slide.cta.label}
                        <ArrowRight size={16} />
                      </Link>
                      <Link
                        href={slide.secondaryCta.href}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20"
                      >
                        {slide.secondaryCta.label}
                      </Link>
                    </div>
                  </div>

                  {/* Icon visual */}
                  <div className="hidden lg:flex justify-center">
                    <div className={`w-48 h-48 rounded-3xl ${slide.iconBg} bg-opacity-30 border border-white/10 flex items-center justify-center`}>
                      <Icon size={80} className="text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          background: #7c3aed;
          opacity: 0.4;
          width: 8px;
          height: 8px;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
        .hero-swiper .swiper-pagination {
          bottom: 20px;
        }
      `}</style>
    </section>
  );
}
