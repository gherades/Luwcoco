"use client";

import { motion, type Variants } from "framer-motion";
import { useId, type ReactNode } from "react";

const STITCH_DURATION = 2;
const BOB_TIMES = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1];
const LINE_LENGTH = 300;

// The dashed thread is a static path (fixed "10 8" dash pattern) revealed by
// an animated clip-rect. Animating `pathLength` directly (Framer's usual
// line-draw trick) replaces any manual strokeDasharray with its own
// fractional one, which silently turns the dashes into a solid line.
const revealVariants: Variants = {
  hidden: { width: 0 },
  visible: (startAt: number) => ({
    width: LINE_LENGTH,
    transition: { duration: STITCH_DURATION, delay: startAt, ease: "linear" },
  }),
};

const needleVariants: Variants = {
  hidden: { left: "0%", top: "50%", opacity: 0, rotate: -55 },
  visible: (startAt: number) => ({
    left: ["0%", "14%", "28%", "42%", "56%", "70%", "84%", "97%"],
    top: ["50%", "15%", "50%", "85%", "50%", "15%", "50%", "38%"],
    rotate: [-55, -20, -55, -85, -55, -20, -55, -70],
    opacity: [0, 1, 1, 1, 1, 1, 1, 1],
    transition: { duration: STITCH_DURATION, delay: startAt, ease: "linear", times: BOB_TIMES },
  }),
};

const knotVariants: Variants = {
  hidden: { r: 0, opacity: 0 },
  visible: (startAt: number) => ({
    r: 4,
    opacity: 1,
    transition: { duration: 0.3, delay: startAt, ease: "backOut" },
  }),
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (startAt: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: startAt, ease: "easeOut" },
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
  knotClassName = "fill-coral",
}: {
  children: ReactNode;
  delay?: number;
  threadClassName?: string;
  needleClassName?: string;
  knotClassName?: string;
}) {
  const clipId = useId();

  // Computed here (plain JS) rather than inside the variants' `visible`
  // callbacks: doing the arithmetic in-callback caused Framer Motion to
  // apply the transition with no delay in this project's setup.
  const knotDelay = delay + STITCH_DURATION - 0.12;
  const textDelay = delay + STITCH_DURATION - 0.25;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
    >
      <div className="relative mb-3 h-7">
        <svg
          viewBox="0 0 300 28"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <clipPath id={clipId}>
            <motion.rect x={0} y={0} height={28} variants={revealVariants} custom={delay} />
          </clipPath>
          <path
            d="M0 14 H300"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="10 8"
            className={threadClassName}
            clipPath={`url(#${clipId})`}
          />
          <motion.circle
            cx={294}
            cy={14}
            className={knotClassName}
            variants={knotVariants}
            custom={knotDelay}
          />
        </svg>
        <motion.div
          variants={needleVariants}
          custom={delay}
          className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 ${needleClassName}`}
        >
          <TravelingNeedle className="h-full w-full" />
        </motion.div>
      </div>
      <motion.div variants={textVariants} custom={textDelay}>
        {children}
      </motion.div>
    </motion.div>
  );
}
