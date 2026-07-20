"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

/* Dynamically import the 3D scene to avoid SSR issues with Three.js */
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const handleExplore = () => {
    const el = document.getElementById("projects");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background Canvas — self-positioned behind everything */}
      <HeroScene />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Top vignette */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-surface-950 to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface-950 to-transparent" />
        {/* Radial glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-neon-cyan/[0.03] blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-purple/[0.04] blur-[100px]" />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 z-[1] grid-bg opacity-40 pointer-events-none" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
      >
        {/* Status badge */}
        <motion.div variants={childVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 px-4 py-1.5 text-xs font-medium tracking-wider text-neon-cyan uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
            </span>
            Available for Opportunities
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={childVariants}
          className="text-lg md:text-xl text-text-secondary mb-4 font-medium"
        >
          Hello, World! I&apos;m
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={childVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-outfit)] tracking-tight mb-6"
        >
          <span className="text-text-primary">Rohit </span>
          <span className="gradient-text">Jha</span>
          <span className="text-neon-cyan">.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={childVariants}
          className="text-xl md:text-2xl text-text-secondary mb-4 font-medium font-[family-name:var(--font-outfit)]"
        >
          Full Stack Developer
          <span className="text-neon-cyan mx-3">&amp;</span>
          B.Tech CSE Student
        </motion.p>

        {/* Description */}
        <motion.p
          variants={childVariants}
          className="max-w-2xl text-base md:text-lg text-text-muted leading-relaxed mb-10"
        >
          Crafting high-performance web experiences with React, Next.js, and
          modern cloud-native technologies. Passionate about turning complex
          ideas into elegant, interactive solutions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={childVariants}
          className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto"
        >
          <button onClick={handleExplore} className="btn-neon group">
            <span className="relative z-10">Explore My Work</span>
            <svg
              className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>

          <a
            href="https://github.com/rohitjha965028-rgb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-text-secondary rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:text-text-primary hover:border-white/20 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View GitHub
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={childVariants}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-text-muted"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
