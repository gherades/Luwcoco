"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { clsx as cn } from "clsx";
import { EASE_DRAPE, sew } from "@/lib/sewing-theme";

type Phase = "idle" | "measuring" | "done";

type TapeMeasureDownloadProps = {
  label?: string;
  doneLabel?: string;
  /** Formato que aparece en la etiqueta del botón. */
  format?: string;
  /** Se espera antes de llegar al final de la cinta (aquí va la descarga real). */
  onDownload?: () => void | Promise<void>;
  /** Vuelve al estado inicial tras estos milisegundos (0 = nunca). */
  resetAfter?: number;
  className?: string;
};

const W = 270;
const H = 56;
const CASE = 40;
const CASE_LEFT = 8;
const TAPE_START = CASE_LEFT + CASE - 4;
const TAPE_MAX = W - TAPE_START - 16;
const TAPE_H = 20;
/** Separación de las marcas de centímetro en la cinta. */
const CM = 4;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Botón «Descargar patrón» con una cinta métrica: al pulsarlo sale
 * el carrete y la cinta se desenrolla marcando centímetros mientras avanza la
 * descarga. Al llegar al final se recoge de golpe (el carrete da un tirón) y
 * el botón queda en «Patrón descargado».
 */
export function TapeMeasureDownload({
  label = "Descargar patrón",
  doneLabel = "Patrón descargado",
  format = "PDF",
  onDownload,
  resetAfter = 2400,
  className,
}: TapeMeasureDownloadProps) {
  const reduce = useReducedMotion() ?? false;
  const [scope, animateCase] = useAnimate<HTMLDivElement>();
  const [phase, setPhase] = useState<Phase>("idle");
  const progress = useMotionValue(0);
  const tapeWidth = useTransform(progress, (k) => k * TAPE_MAX);
  const percent = useTransform(progress, (k) => `${Math.round(k * 100)}`);
  const running = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const start = async () => {
    if (running.current) return;
    running.current = true;
    const work = Promise.resolve()
      .then(() => onDownload?.())
      .catch(() => undefined);
    try {
      if (reduce) {
        await work;
        setPhase("done");
      } else {
        progress.set(0);
        setPhase("measuring");
        await wait(320);
        await animate(progress, 0.92, { duration: 1.8, ease: [0.3, 0.1, 0.4, 1] });
        await work;
        await animate(progress, 1, { duration: 0.3, ease: "easeOut" });
        await wait(260);
        // Se recoge de golpe y el carrete da un tirón.
        animate(progress, 0, { duration: 0.26, ease: [0.6, 0, 0.9, 0.4] });
        await wait(200);
        await animateCase(
          scope.current,
          { rotate: [0, -28, 12, -5, 0], x: [0, 4, -2, 0] },
          { duration: 0.5, ease: "easeOut" },
        );
        if (!alive.current) return;
        setPhase("done");
      }
      if (resetAfter > 0) {
        await wait(resetAfter);
        if (alive.current) setPhase("idle");
      }
    } finally {
      running.current = false;
    }
  };

  const done = phase === "done";

  return (
    <button
      type="button"
      onClick={start}
      disabled={phase === "measuring"}
      aria-busy={phase === "measuring"}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default",
        className,
      )}
      style={{
        width: W,
        height: H,
        fontFamily: sew.sans,
        color: sew.cream,
        backgroundColor: done ? sew.thread : sew.ink,
        transition: "background-color .35s",
        ["--tw-ring-color" as string]: sew.thread,
      }}
    >
      <span className="sr-only" aria-live="polite">
        {phase === "measuring" ? "Descargando el patrón" : done ? doneLabel : ""}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        {phase !== "measuring" && (
          <motion.span
            key={phase}
            className="absolute inset-0 flex items-center justify-center gap-2 text-[14px] font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {done ? (
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              ) : (
                <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
              )}
            </svg>
            {done ? doneLabel : label}
            {!done && (
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium"
                style={{ fontFamily: sew.mono, backgroundColor: sew.coral, color: sew.paper }}
              >
                {format}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "measuring" && (
          <motion.span
            key="tape"
            aria-hidden
            className="absolute inset-0 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {/* Cinta: una regla fija que se va descubriendo al salir del carrete. */}
            <motion.span
              className="absolute block overflow-hidden rounded-r-[3px]"
              style={{
                left: TAPE_START,
                top: (H - TAPE_H) / 2,
                height: TAPE_H,
                width: tapeWidth,
                backgroundColor: sew.blush,
                boxShadow: "0 2px 6px rgb(0 0 0 / 0.35)",
              }}
            >
              <span
                className="absolute inset-y-0 left-0 block"
                style={{
                  width: TAPE_MAX,
                  backgroundImage: `repeating-linear-gradient(90deg, ${sew.ink} 0 1px, transparent 1px ${CM}px), repeating-linear-gradient(90deg, ${sew.ink} 0 1.2px, transparent 1.2px ${CM * 5}px)`,
                  backgroundSize: `100% 28%, 100% 48%`,
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "0 0, 0 0",
                }}
              />
              {Array.from({ length: Math.floor(TAPE_MAX / (CM * 10)) }, (_, i) => (
                <span
                  key={i}
                  className="absolute bottom-[1px] -translate-x-1/2 text-[8px] leading-none font-medium"
                  style={{ left: (i + 1) * CM * 10, fontFamily: sew.mono, color: sew.ink }}
                >
                  {(i + 1) * 10}
                </span>
              ))}
            </motion.span>
            {/* Gancho metálico de la punta. */}
            <motion.span
              className="absolute block rounded-[1.5px]"
              style={{
                left: TAPE_START - 1,
                x: tapeWidth,
                top: (H - TAPE_H) / 2 - 3,
                width: 4,
                height: TAPE_H + 6,
                background: "linear-gradient(90deg, #cfd2d6, #8d9197)",
              }}
            />

            {/* Carrete con el porcentaje. */}
            <motion.span
              ref={scope}
              className="absolute grid place-items-center rounded-full"
              style={{
                left: CASE_LEFT,
                top: (H - CASE) / 2,
                width: CASE,
                height: CASE,
                backgroundColor: sew.coral,
                boxShadow: `inset 0 0 0 3px rgb(0 0 0 / 0.12), 0 4px 10px rgb(0 0 0 / 0.35)`,
              }}
              initial={{ x: -60, rotate: -90 }}
              animate={{ x: 0, rotate: 0 }}
              transition={{ duration: 0.45, ease: EASE_DRAPE }}
            >
              <span
                className="grid size-[26px] place-items-center rounded-full text-[10px] font-medium tabular-nums"
                style={{ backgroundColor: sew.paper, color: sew.ink, fontFamily: sew.mono }}
              >
                <motion.span>{percent}</motion.span>
              </span>
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
