"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { clsx as cn } from "clsx";
import { EASE_STITCH, sew } from "@/lib/sewing-theme";

type Phase = "idle" | "sewing" | "added";

type StitchAddButtonProps = {
  label?: string;
  addedLabel?: string;
  /** Tamaño de tarjeta de producto (más bajo y con texto corto). */
  compact?: boolean;
  /** Se llama al pulsar, antes de coser: ahí va añadir el producto al carrito. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Milisegundos que dura «Añadido» antes de volver (0 = se queda). */
  resetAfter?: number;
  className?: string;
};

/** Pespunte: contorno de píldora metido hacia dentro, empezando arriba a la izquierda. */
function stitchPath(width: number, height: number, inset: number) {
  const r = height / 2 - inset;
  const left = inset + r;
  const right = width - inset - r;
  return `M ${left} ${inset} H ${right} A ${r} ${r} 0 0 1 ${right} ${height - inset} H ${left} A ${r} ${r} 0 0 1 ${left} ${inset} Z`;
}

/**
 * Botón «Añadir al carrito» con temática de costura: tiene un pespunte suave por dentro
 * del borde. Al pulsarlo, una aguja recorre el contorno cosiendo el hilo en
 * azul, remata con un nudo coral y el botón queda en «Añadido».
 */
export function StitchAddButton({
  label,
  addedLabel,
  compact = false,
  onAdd,
  resetAfter = 1600,
  className,
}: StitchAddButtonProps) {
  const reduce = useReducedMotion() ?? false;
  const maskId = `${useId().replace(/[^a-zA-Z0-9]/g, "")}sewn`;
  const ref = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ width: compact ? 132 : 240, height: compact ? 36 : 52 });
  const [phase, setPhase] = useState<Phase>("idle");
  const sewn = useMotionValue(0);
  const needleX = useMotionValue(0);
  const needleY = useMotionValue(0);
  const needleAngle = useMotionValue(0);
  const knot = useTransform(sewn, [0.97, 1], [0, 1]);
  const running = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // El pespunte se dibuja a la medida real del botón (sirve a ancho completo).
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setSize({ width: element.offsetWidth, height: element.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const inset = compact ? 4 : 5;
  const d = stitchPath(size.width, size.height, inset);

  const startSewing = (event: MouseEvent<HTMLButtonElement>) => {
    if (running.current) return;
    running.current = true;
    onAdd?.(event);
    setPhase("sewing");
    const path = pathRef.current;
    const length = path?.getTotalLength() ?? 0;
    const finish = async () => {
      if (!alive.current) return;
      setPhase("added");
      if (resetAfter > 0) {
        await new Promise((resolve) => setTimeout(resolve, resetAfter));
        if (!alive.current) return;
        setPhase("idle");
        animate(sewn, 0, { duration: 0.4 });
      }
      running.current = false;
    };
    if (reduce || !path) {
      sewn.set(1);
      void finish();
      return;
    }
    animate(0, 1, {
      duration: compact ? 0.75 : 1,
      ease: EASE_STITCH,
      onUpdate: (k) => {
        const at = path.getPointAtLength(k * length);
        const ahead = path.getPointAtLength(Math.min(length, k * length + 1.5));
        needleX.set(at.x);
        needleY.set(at.y);
        if (ahead.x !== at.x || ahead.y !== at.y) {
          needleAngle.set((Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI);
        }
        sewn.set(k);
      },
      onComplete: () => void finish(),
    });
  };

  const text =
    phase === "added"
      ? (addedLabel ?? (compact ? "Añadido" : "Añadido al carrito"))
      : (label ?? (compact ? "Añadir" : "Añadir al carrito"));
  const filled = phase === "added";

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={startSewing}
      aria-live="polite"
      whileTap={phase === "idle" ? { scale: compact ? 0.94 : 0.97 } : undefined}
      className={cn(
        "relative isolate inline-flex cursor-pointer items-center justify-center rounded-full font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        compact ? "h-9 min-w-[132px] px-4 text-[12px]" : "h-[52px] min-w-[240px] px-7 text-[14px]",
        className,
      )}
      style={{
        fontFamily: sew.sans,
        color: filled ? sew.cream : sew.ink,
        backgroundColor: filled ? sew.thread : sew.paper,
        boxShadow: `inset 0 0 0 1.5px ${filled ? sew.thread : sew.ink}`,
        transition: "background-color .35s, color .35s, box-shadow .35s",
        ["--tw-ring-color" as string]: sew.thread,
      }}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={size.width}
        height={size.height}
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-10}
            y={-10}
            width={size.width + 20}
            height={size.height + 20}
          >
            <motion.path
              d={d}
              fill="none"
              stroke="white"
              strokeWidth={6}
              style={{ pathLength: sewn }}
            />
          </mask>
        </defs>
        {/* Pespunte marcado en el papel (tenue) y el hilo ya cosido encima. */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke={sew.line}
          strokeWidth={1.3}
          strokeDasharray="5 4"
        />
        <path
          d={d}
          fill="none"
          stroke={filled ? sew.cream : sew.thread}
          strokeWidth={1.8}
          strokeDasharray="5 4"
          strokeLinecap="round"
          mask={`url(#${maskId})`}
          style={{ transition: "stroke .35s" }}
        />
        {/* Nudo de remate. */}
        <motion.circle
          cx={size.height / 2}
          cy={inset}
          r={2.6}
          fill={sew.coral}
          style={{ opacity: knot, scale: knot }}
        />
      </svg>

      {/* Aguja con su ojo, orientada según el pespunte. */}
      <AnimatePresence>
        {phase === "sewing" && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 block"
            style={{ x: needleX, y: needleY, rotate: needleAngle, width: 0, height: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <svg
              viewBox="0 0 26 8"
              width={26}
              height={8}
              className="absolute -top-1 -left-[3px] overflow-visible"
            >
              <path d="M1 4 L19 2.4 Q25 4 19 5.6 Z" fill={sew.inkSoft} />
              <ellipse cx={17.5} cy={4} rx={1.8} ry={0.8} fill={sew.paper} />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={filled ? "added" : "add"}
          className="relative flex items-center gap-1.5 whitespace-nowrap"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <svg
            viewBox="0 0 24 24"
            className={compact ? "size-[13px]" : "size-4"}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {filled ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <path d="M12 5v14M5 12h14" />}
          </svg>
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
