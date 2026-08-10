"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { EASE_DRAPE } from "@/lib/motion";
import { CompassMark } from "@/components/SewingMotifs";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

function StaticCentrepiece() {
  return (
    <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_25%,#163455,transparent_55%),radial-gradient(circle_at_75%_70%,#1c3a55,transparent_50%)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-paper/45 sm:h-36 sm:w-36"
      >
        <CompassMark className="h-full w-full" />
      </motion.div>
    </div>
  );
}

const AboutHeroCanvas = dynamic(
  () => import("./AboutHeroCanvas").then((m) => m.AboutHeroCanvas),
  { ssr: false, loading: StaticCentrepiece },
);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function getReducedMotionServer() {
  return false;
}

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgress.current = v;
  });

  const sceneOpacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const overlayY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[145vh] bg-[#0b1f33] text-paper"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {!prefersReducedMotion ? (
          <motion.div className="absolute inset-0" style={{ opacity: sceneOpacity }}>
            <WebGLErrorBoundary fallback={<StaticCentrepiece />}>
              <AboutHeroCanvas scrollRef={scrollProgress} />
            </WebGLErrorBoundary>
          </motion.div>
        ) : (
          <StaticCentrepiece />
        )}

        <motion.div
          style={{ y: overlayY, opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_DRAPE }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] backdrop-blur"
          >
            Plano 001 · Sobre mí
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_DRAPE }}
            className="text-balance font-display text-4xl font-medium leading-[1.08] sm:text-6xl lg:text-7xl"
          >
            De los planos a los <span className="italic text-blush">patrones</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: EASE_DRAPE }}
            className="mt-6 max-w-lg text-balance text-lg text-paper/85"
          >
            Soy Lucía: arquitecta de formación, costurera de vocación. Esta
            es la historia detrás de cada patrón que descargas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: EASE_DRAPE }}
            className="pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#historia"
              className="rounded-full bg-coral px-7 py-3 text-sm font-semibold text-graphite transition-transform hover:scale-[1.03] hover:bg-coral/90"
            >
              Descubre mi historia
            </a>
            <Link
              href="/patrones"
              className="rounded-full border border-paper/40 px-7 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              Ver los patrones
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60"
        >
          <span>Desliza</span>
          <motion.span
            className="h-8 w-px bg-paper/40"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
