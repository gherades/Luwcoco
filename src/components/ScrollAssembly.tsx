"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { iconPieces, type IconName } from "./PatternIcon";
import { withBasePath } from "@/lib/basePath";

export function ScrollAssembly({
  icon,
  patternImage,
  productName,
}: {
  icon: IconName;
  patternImage?: string;
  productName: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  const pieces = iconPieces[icon];
  const stepSize = 1 / pieces.length;
  const revealAt = (i: number) =>
    Math.min(1, Math.max(0, (progress - i * stepSize) / stepSize));

  const finished = progress > 0.97;

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${pieces.length * 55 + 45}vh` }}>
      <div className="sticky top-24 flex h-[65vh] items-center justify-center overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-denim/40 to-cream-dim">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-56 w-56 text-ink/75 sm:h-72 sm:w-72"
        >
          {pieces.map((piece, i) => {
            const t = revealAt(i);
            return (
              <g
                key={i}
                style={{
                  opacity: t,
                  transform: `translateY(${(1 - t) * 10}px)`,
                }}
              >
                {piece}
              </g>
            );
          })}
        </svg>

        <span className="absolute bottom-4 rounded-full bg-cream/90 px-4 py-1.5 text-xs font-medium text-ink-soft backdrop-blur">
          {finished ? "¡Terminado! 🧵 Sigue bajando para ver la bolsa real" : "Sigue bajando para coserlo…"}
        </span>

        {patternImage && (
          <div className="absolute right-4 top-4 h-16 w-14 overflow-hidden rounded-lg border border-line shadow-sm sm:h-20 sm:w-16">
            <Image
              src={withBasePath(patternImage)}
              alt={`Portada del patrón ${productName}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
