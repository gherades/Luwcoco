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
  const canAnimate = useSyncExternalStore(
    subscribeMotionPreference,
    getMotionPreference,
    getMotionPreferenceServer,
  );

  // `children` render directly, never wrapped in an AnimatePresence/motion.div:
  // doing that here made every nested whileInView animation on the new page
  // (e.g. the Sobre mí stitch reveal) snap instantly to its end state instead
  // of tweening. The coral seam sweep below is what actually reads as "the
  // page changed" and doesn't wrap or touch page content at all.
  return (
    <>
      {children}
      {canAnimate && (
        <AnimatePresence>
          <motion.div
            key={pathname}
            aria-hidden
            className="pointer-events-none fixed inset-y-0 left-0 z-[80] w-[3px] bg-coral"
            initial={{ x: "0vw", opacity: 0 }}
            animate={{ x: "100vw", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, ease: EASE_DRAPE, times: [0, 0.15, 0.85, 1] }}
          />
        </AnimatePresence>
      )}
    </>
  );
}
