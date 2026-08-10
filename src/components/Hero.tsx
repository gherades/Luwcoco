"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PatternIcon } from "./PatternIcon";
import { EASE_DRAPE } from "@/lib/motion";

const floating = [
  { icon: "duffbag" as const, className: "left-[6%] top-[18%] h-20 w-20 sm:h-24 sm:w-24", delay: 0 },
  { icon: "top" as const, className: "right-[8%] top-[10%] h-16 w-16 sm:h-20 sm:w-20", delay: 0.4 },
  { icon: "skirt" as const, className: "left-[14%] bottom-[10%] h-16 w-16 sm:h-20 sm:w-20", delay: 0.8 },
  { icon: "totebag" as const, className: "right-[12%] bottom-[16%] h-20 w-20 sm:h-24 sm:w-24", delay: 1.2 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-thread-dark text-paper">
      <div className="absolute inset-0 opacity-90 [background:radial-gradient(circle_at_20%_20%,#3d5b73,transparent_55%),radial-gradient(circle_at_80%_75%,#59738a,transparent_50%)]" />

      {floating.map((f, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute hidden text-paper/25 sm:block ${f.className}`}
          animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 6, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <PatternIcon icon={f.icon} className="h-full w-full" />
        </motion.div>
      ))}

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_DRAPE }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] backdrop-blur"
        >
          Patrones digitales · PDF + vídeo
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_DRAPE }}
          className="text-balance font-display text-5xl font-medium leading-[1.05] sm:text-7xl"
        >
          anímate a{" "}
          <span className="italic text-blush">coser</span> conmigo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE_DRAPE }}
          className="mt-6 max-w-xl text-balance text-lg text-paper/85"
        >
          Patrones de costura paso a paso, pensados para que crees tu propio
          armario desde cero — sin importar tu nivel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE_DRAPE }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/patrones"
            className="rounded-full bg-coral px-7 py-3 text-sm font-semibold text-graphite transition-transform hover:scale-[1.03] hover:bg-coral/90"
          >
            Ver patrones
          </Link>
          <Link
            href="/sobre-mi"
            className="rounded-full border border-paper/40 px-7 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
          >
            Conóceme
          </Link>
        </motion.div>
      </div>

      <svg
        className="relative block w-full text-cream"
        viewBox="0 0 1440 60"
        fill="currentColor"
        preserveAspectRatio="none"
      >
        <path d="M0 30 Q 360 0 720 30 T 1440 30 V60 H0 Z" />
      </svg>
    </section>
  );
}
