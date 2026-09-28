"use client";

import { AnimatePresence, motion, useAnimate, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clsx as cn } from "clsx";
import { EASE_DRAPE, EASE_STITCH, euros, sew } from "@/lib/sewing-theme";

type Phase = "idle" | "cutting" | "opening" | "error";

type ScissorsBuyButtonProps = {
  price?: number;
  label?: string;
  /** Tras el corte se llama y se espera: ahí va abrir la pasarela de pago. */
  onCheckout?: () => void | Promise<void>;
  /** Ancho en píxeles; sin él ocupa todo el ancho de su contenedor. */
  width?: number;
  /** Vuelve al estado inicial tras estos milisegundos (0 = nunca). */
  resetAfter?: number;
  className?: string;
};

const H = 56;
const STUB = 98;
const CUT_TIME = 0.6;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Botón «Comprar» con forma de cupón: el precio va en una
 * pestaña separada por una línea de corte. Al pulsarlo, unas tijeras bajan
 * cortando por la línea de puntos, la pestaña del precio cae y el botón se
 * extiende para abrir el pago seguro.
 */
export function ScissorsBuyButton({
  price = 9.95,
  label = "Comprar",
  onCheckout,
  width,
  resetAfter = 2600,
  className,
}: ScissorsBuyButtonProps) {
  const reduce = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [phase, setPhase] = useState<Phase>("idle");
  const running = useRef(false);
  const alive = useRef(true);
  const [measured, setMeasured] = useState(width ?? 290);
  const full = width ?? measured;
  const main = full - STUB;

  // Sin ancho fijo, se mide para colocar la línea de corte y la pestaña.
  useLayoutEffect(() => {
    const element = scope.current;
    if (width !== undefined || !element) return;
    const measure = () => setMeasured(element.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width, scope]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const reset = () => {
    animate("[data-stub]", { y: 0, x: 0, rotate: 0, opacity: 1 }, { duration: 0 });
    animate("[data-main]", { width: main + H / 2 }, { duration: 0 });
    animate("[data-cut]", { scaleY: 0, opacity: 1 }, { duration: 0 });
  };

  const buy = async () => {
    if (running.current) return;
    running.current = true;
    try {
      if (!reduce) {
        setPhase("cutting");
        // Las tijeras bajan por la línea abriendo y cerrando las hojas.
        animate("[data-scissors]", { y: [0, H - 14] }, { duration: CUT_TIME, ease: EASE_STITCH });
        animate(
          '[data-blade="a"]',
          { rotate: [0, 20, 0, 20, 0, 20, 0] },
          { duration: CUT_TIME, ease: "easeInOut" },
        );
        animate(
          '[data-blade="b"]',
          { rotate: [0, -20, 0, -20, 0, -20, 0] },
          { duration: CUT_TIME, ease: "easeInOut" },
        );
        await animate("[data-cut]", { scaleY: [0, 1] }, { duration: CUT_TIME, ease: EASE_STITCH });

        // La pestaña del precio se suelta y cae; el botón ocupa su sitio.
        animate(
          "[data-stub]",
          { y: 70, x: 16, rotate: 18, opacity: 0 },
          { duration: 0.65, ease: [0.5, 0, 0.9, 0.6] },
        );
        animate("[data-cut]", { opacity: 0 }, { duration: 0.3, delay: 0.2 });
        await animate("[data-main]", { width: full }, { duration: 0.55, ease: EASE_DRAPE });
      }
      if (!alive.current) return;
      setPhase("opening");
      try {
        await Promise.all([Promise.resolve().then(() => onCheckout?.()), wait(reduce ? 0 : 900)]);
      } catch {
        if (!alive.current) return;
        setPhase("error");
      }
      if (resetAfter > 0) {
        await wait(resetAfter);
        if (!alive.current) return;
        reset();
        setPhase("idle");
      }
    } finally {
      running.current = false;
    }
  };

  const busy = phase === "cutting" || phase === "opening";

  return (
    <div
      ref={scope}
      className={cn("relative", className)}
      style={{ width: width ?? "100%", height: H, fontFamily: sew.sans }}
    >
      <p className="sr-only" aria-live="polite">
        {phase === "opening"
          ? "Abriendo el pago seguro"
          : phase === "error"
            ? "No se pudo abrir el pago"
            : ""}
      </p>

      <motion.button
        type="button"
        onClick={buy}
        disabled={busy}
        aria-label={`${label}, ${euros(price)}`}
        whileTap={phase === "idle" ? { scale: 0.98 } : undefined}
        className="absolute inset-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default"
        style={{ ["--tw-ring-color" as string]: sew.thread }}
      >
        {/* Cuerpo del botón. */}
        <motion.span
          data-main
          className="absolute inset-y-0 left-0 flex items-center justify-center gap-2 overflow-hidden rounded-full text-[14px] font-semibold"
          style={{
            // Píldora entera: su extremo derecho queda escondido bajo la pestaña del precio.
            width: main + H / 2,
            paddingRight: phase === "idle" || phase === "cutting" ? H / 2 : 0,
            backgroundColor: phase === "error" ? sew.coral : sew.ink,
            color: sew.cream,
            transition: "background-color .3s",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={phase === "opening" ? "opening" : phase === "error" ? "error" : "idle"}
              className="flex items-center gap-2 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {phase === "opening" ? (
                <motion.span
                  className="block size-4 rounded-full border-2"
                  style={{ borderColor: `${sew.cream} transparent ${sew.cream} ${sew.cream}` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
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
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              )}
              {phase === "opening"
                ? "Abriendo pago seguro…"
                : phase === "error"
                  ? "Inténtalo de nuevo"
                  : label}
            </motion.span>
          </AnimatePresence>
        </motion.span>

        {/* Pestaña del precio, separada por la línea de corte. */}
        <span
          data-stub
          className="absolute inset-y-0 right-0 flex items-center justify-center rounded-r-full text-[14px] font-medium"
          style={{
            width: STUB - 3,
            backgroundColor: sew.ink,
            color: sew.cream,
            fontFamily: sew.mono,
            transformOrigin: "20% 0%",
          }}
        >
          {euros(price)}
        </span>
      </motion.button>

      {/* Línea de puntos y el corte que dejan las tijeras. */}
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: main - 1.5,
          top: 7,
          bottom: 7,
          width: 1.5,
          backgroundImage: `repeating-linear-gradient(180deg, ${sew.cream} 0 3px, transparent 3px 6px)`,
          opacity: phase === "idle" ? 0.55 : 0,
          transition: "opacity .2s",
        }}
      />
      <span
        data-cut
        aria-hidden
        className="pointer-events-none absolute origin-top"
        style={{
          left: main - 2.5,
          top: 0,
          width: 5,
          height: H,
          backgroundColor: sew.cream,
          transform: "scaleY(0)",
        }}
      />

      {/* Tijeras: hojas que se abren y cierran sobre su eje. */}
      <span
        data-scissors
        aria-hidden
        className="pointer-events-none absolute block"
        style={{
          left: main - 13,
          top: -12,
          width: 26,
          height: 26,
          opacity: phase === "cutting" ? 1 : 0,
        }}
      >
        {(["a", "b"] as const).map((blade) => (
          <span
            key={blade}
            data-blade={blade}
            className="absolute inset-0 block"
            style={{ transformOrigin: "50% 42%" }}
          >
            <svg viewBox="0 0 26 26" className="size-full overflow-visible">
              <g transform={blade === "b" ? "translate(26 0) scale(-1 1)" : undefined}>
                <circle
                  cx={8.5}
                  cy={4.5}
                  r={3.4}
                  fill="none"
                  stroke={sew.coral}
                  strokeWidth={2.2}
                />
                <path
                  d="M10.6 7.2 14 11 12.3 25 11.4 11.6Z"
                  fill={sew.paper}
                  stroke={sew.ink}
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        ))}
        <span
          className="absolute top-[42%] left-1/2 block size-1.5 -translate-1/2 rounded-full"
          style={{ backgroundColor: sew.ink }}
        />
      </span>
    </div>
  );
}
