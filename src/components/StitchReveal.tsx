"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const STITCH_DURATION = 0.75;

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: (delay: number) => ({
    scaleX: 1,
    transition: { duration: STITCH_DURATION, delay, ease: "easeInOut" },
  }),
};

const dotVariants: Variants = {
  hidden: { left: "0%", opacity: 0 },
  visible: (delay: number) => ({
    left: "100%",
    opacity: [0, 1, 1, 0],
    transition: { duration: STITCH_DURATION, delay, ease: "easeInOut" },
  }),
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: delay + STITCH_DURATION - 0.15, ease: "easeOut" },
  }),
};

export function StitchReveal({
  children,
  delay = 0,
  lineClassName = "border-thread/50",
  dotClassName = "bg-coral",
}: {
  children: ReactNode;
  delay?: number;
  lineClassName?: string;
  dotClassName?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      custom={delay}
    >
      <div className="relative mb-2.5 h-3">
        <motion.div
          variants={lineVariants}
          style={{ transformOrigin: "left" }}
          className={`absolute inset-x-0 top-1/2 border-t-2 border-dashed ${lineClassName}`}
        />
        <motion.div
          variants={dotVariants}
          className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClassName}`}
        />
      </div>
      <motion.div variants={textVariants}>{children}</motion.div>
    </motion.div>
  );
}
