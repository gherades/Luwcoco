"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import { EASE_DRAPE } from "@/lib/motion";

const QUERY = "(prefers-reduced-motion: no-preference)";

function subscribeMotionPreference(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getMotionPreference() {
  return window.matchMedia(QUERY).matches;
}

function getMotionPreferenceServer() {
  return false;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // children stay wrapped in the same structure regardless of the reduced
  // motion preference, so correcting it after hydration never remounts the
  // page — only the transition duration/values change.
  const canAnimate = useSyncExternalStore(
    subscribeMotionPreference,
    getMotionPreference,
    getMotionPreferenceServer,
  );

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: canAnimate ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: canAnimate ? 0 : 1 }}
          transition={{ duration: canAnimate ? 0.28 : 0, ease: EASE_DRAPE }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {canAnimate && (
        <AnimatePresence>
          <motion.div
            key={pathname}
            aria-hidden
            className="pointer-events-none fixed inset-y-0 left-0 z-[80] w-[3px] bg-coral"
            initial={{ x: "0vw", opacity: 0 }}
            animate={{ x: "100vw", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.5, ease: EASE_DRAPE, times: [0, 0.15, 0.85, 1] }}
          />
        </AnimatePresence>
      )}
    </>
  );
}
