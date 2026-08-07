"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const STITCH_DURATION = 2;

const threadVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    transition: { duration: STITCH_DURATION, delay, ease: "linear" },
  }),
};

const needleVariants: Variants = {
  hidden: { left: "0%", top: "50%", opacity: 0, rotate: -55 },
  visible: (delay: number) => ({
    left: "100%",
    opacity: [0, 1, 1, 1, 1, 1, 1, 0],
    top: ["50%", "15%", "50%", "85%", "50%", "15%", "50%", "85%"],
    rotate: [-55, -20, -55, -85, -55, -20, -55, -85],
    transition: {
      duration: STITCH_DURATION,
      delay,
      ease: "linear",
      times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1],
    },
  }),
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: delay + STITCH_DURATION - 0.25, ease: "easeOut" },
  }),
};

function TravelingNeedle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
      <path d="M3 21 17 7" />
      <ellipse cx="18.6" cy="5.4" rx="2.1" ry="3.1" transform="rotate(45 18.6 5.4)" />
    </svg>
  );
}

export function StitchReveal({
  children,
  delay = 0,
  threadClassName = "stroke-thread/60",
  needleClassName = "text-ink/70",
}: {
  children: ReactNode;
  delay?: number;
  threadClassName?: string;
  needleClassName?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      custom={delay}
    >
      <div className="relative mb-3 h-7">
        <svg
          viewBox="0 0 300 28"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <motion.path
            d="M0 14 H300"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="7 6"
            className={threadClassName}
            variants={threadVariants}
          />
        </svg>
        <motion.div
          variants={needleVariants}
          className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 ${needleClassName}`}
        >
          <TravelingNeedle className="h-full w-full" />
        </motion.div>
      </div>
      <motion.div variants={textVariants}>{children}</motion.div>
    </motion.div>
  );
}
