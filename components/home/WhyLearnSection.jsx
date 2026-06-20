"use client";

import { motion } from "framer-motion";
import { Brain, Heart, Globe, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Preserve Your Wisdom",
    description:
      "Life teaches us invaluable lessons, but memory fades. Writing them down transforms fleeting insights into permanent wisdom you can revisit anytime.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Heart,
    title: "Encourage Mindful Reflection",
    description:
      "The act of articulating your experiences builds self-awareness. Documenting your journey helps you understand patterns and grow intentionally.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: Globe,
    title: "Inspire Your Community",
    description:
      "Your unique experiences carry universal truths. Sharing publicly creates ripples — your hardship or triumph might be exactly what someone needs today.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: TrendingUp,
    title: "Track Personal Growth",
    description:
      "Reading your past lessons reveals how far you've come. Your growth becomes visible, measurable, and motivating when documented over time.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function WhyLearnSection() {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/20">
            Why It Matters
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-white mt-4 mb-4">
            Why Learning From Life Matters
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Personal experiences hold more wisdom than any textbook. Here's why
            preserving and sharing life lessons creates lasting impact.
          </p>
        </motion.div>

        {/* Cards — framer-motion staggered */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={cardVariants}
                className={`${b.bg} border ${b.border} rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${b.bg} border ${b.border} flex items-center justify-center`}>
                  <Icon size={22} className={b.color} />
                </div>
                <h3 className="text-white font-semibold text-base">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
