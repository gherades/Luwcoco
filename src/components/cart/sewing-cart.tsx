"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { clsx as cn } from "clsx";
import { GarmentIcon, type GarmentIconName } from "./garment-icons";
import { ScissorsBuyButton } from "@/components/buttons/scissors-buy-button";
import { StitchAddButton } from "@/components/buttons/stitch-add-button";
import { EASE_DRAPE, EASE_STITCH, euros, sew } from "@/lib/sewing-theme";

export type SewingCartItem = {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  qty: number;
  icon?: GarmentIconName;
};

type SewingCartProps = {
  items: SewingCartItem[];
  onQtyChange?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
  onCheckout?: (total: number) => void | Promise<void>;
  onClose?: () => void;
  /** Se muestra con el carrito vacío («Ver patrones»). */
  onBrowse?: () => void;
  /** Patrón sugerido para completar el pedido (se oculta si ya está en el carrito). */
  suggestion?: Omit<SewingCartItem, "qty">;
  onAddSuggestion?: (item: Omit<SewingCartItem, "qty">) => void;
  /** Descuento sobre la unidad más barata en cuanto hay dos o más. */
  discountRate?: number;
  /** Ancho en píxeles; sin él ocupa todo su contenedor (por ejemplo, un cajón lateral). */
  width?: number;
  /** Aviso bajo el botón de compra (condiciones, estado de la pasarela…). */
  notice?: ReactNode;
  className?: string;
};

/**
 * Promo de pack: con dos o más unidades, la más barata del pedido lleva un
 * descuento (una sola vez por pedido).
 */
export function bundleDiscount(items: { price: number; qty: number }[], rate = 0.2) {
  const units = items.flatMap((item) => Array<number>(item.qty).fill(item.price));
  if (units.length < 2) return 0;
  return Math.min(...units) * rate;
}

/** Número que rueda hasta su nuevo valor. */
function Rolling({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const shown = useMotionValue(value);
  const text = useTransform(shown, (v) => euros(v));
  useEffect(() => {
    const controls = animate(shown, value, { duration: reduce ? 0 : 0.5, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduce, shown]);
  return <motion.span className={className}>{text}</motion.span>;
}

/**
 * Carrito para una tienda de patrones: cada patrón va en su sobre con el dibujo de la prenda,
 * un hilo marca lo que falta para el descuento del segundo patrón (y cose una
 * etiqueta coral al conseguirlo), quitar un patrón lo descose antes de
 * desaparecer, el total rueda y la compra se recorta con tijeras.
 */
export function SewingCart({
  items,
  onQtyChange,
  onRemove,
  onCheckout,
  onClose,
  onBrowse,
  suggestion,
  onAddSuggestion,
  discountRate = 0.2,
  width,
  notice,
  className,
}: SewingCartProps) {
  const reduce = useReducedMotion() ?? false;
  const [removing, setRemoving] = useState<string[]>([]);
  const units = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = bundleDiscount(items, discountRate);
  const total = subtotal - discount;
  const eligible = discount > 0;
  const percent = Math.round(discountRate * 100);
  const showSuggestion = suggestion && !items.some((item) => item.id === suggestion.id);

  const remove = (id: string) => {
    if (reduce) return onRemove?.(id);
    setRemoving((list) => [...list, id]);
    setTimeout(() => {
      setRemoving((list) => list.filter((item) => item !== id));
      onRemove?.(id);
    }, 420);
  };

  return (
    <section
      aria-label="Carrito"
      className={cn(
        "flex flex-col overflow-hidden rounded-[20px] shadow-[0_24px_60px_-30px_rgb(41_37_32/0.5)]",
        className,
      )}
      style={{
        width: width ?? "100%",
        backgroundColor: sew.cream,
        color: sew.ink,
        fontFamily: sew.sans,
      }}
    >
      <header
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: sew.line }}
      >
        <div className="flex items-baseline gap-2">
          <h2 className="text-[20px] font-medium" style={{ fontFamily: sew.display }}>
            Tu carrito
          </h2>
          <span className="text-[11px]" style={{ fontFamily: sew.mono, color: sew.inkSoft }}>
            {units} {units === 1 ? "patrón" : "patrones"}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="cursor-pointer p-1"
            style={{ color: sew.inkSoft }}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
          <EmptyBasket />
          <p className="text-[14px]" style={{ color: sew.inkSoft }}>
            Todavía no has añadido ningún patrón.
          </p>
          <button
            type="button"
            onClick={onBrowse}
            className="cursor-pointer rounded-full px-6 py-2.5 text-[13px] font-semibold"
            style={{ backgroundColor: sew.ink, color: sew.cream }}
          >
            Ver patrones
          </button>
        </div>
      ) : (
        <>
          <ThreadPromo units={units} eligible={eligible} percent={percent} />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ul className="flex flex-col px-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartRow
                    key={item.id}
                    item={item}
                    removing={removing.includes(item.id)}
                    onQty={(qty) => (qty <= 0 ? remove(item.id) : onQtyChange?.(item.id, qty))}
                    onRemove={() => remove(item.id)}
                  />
                ))}
              </AnimatePresence>
            </ul>

            <AnimatePresence initial={false}>
              {showSuggestion && (
                <motion.div
                  key="suggestion"
                  className="overflow-hidden px-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_DRAPE }}
                >
                  <div
                    className="mt-3 flex items-center gap-3 rounded-xl border border-dashed p-3"
                    style={{ borderColor: sew.line }}
                  >
                    <div
                      className="grid size-11 shrink-0 place-items-center rounded-lg"
                      style={{ backgroundColor: sew.denim, color: sew.thread }}
                    >
                      <GarmentIcon icon={suggestion.icon ?? "top"} className="size-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] tracking-[0.15em] uppercase"
                        style={{ fontFamily: sew.mono, color: sew.coral }}
                      >
                        Completa tu pedido
                      </p>
                      <p
                        className="truncate text-[14px] leading-tight"
                        style={{ fontFamily: sew.display }}
                      >
                        {suggestion.name}
                      </p>
                      <p
                        className="text-[11px]"
                        style={{ fontFamily: sew.mono, color: sew.inkSoft }}
                      >
                        {euros(suggestion.price)}
                      </p>
                    </div>
                    <StitchAddButton
                      compact
                      className="min-w-[96px]!"
                      resetAfter={0}
                      onAdd={() =>
                        setTimeout(() => onAddSuggestion?.(suggestion), reduce ? 0 : 900)
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="mt-4 border-t px-6 pt-4 pb-5" style={{ borderColor: sew.line }}>
            <dl className="flex flex-col gap-1 text-[13px]" style={{ fontFamily: sew.mono }}>
              <div className="flex justify-between">
                <dt className="tracking-wide uppercase" style={{ color: sew.inkSoft }}>
                  Subtotal
                </dt>
                <dd>
                  <Rolling value={subtotal} />
                </dd>
              </div>
              <AnimatePresence initial={false}>
                {eligible && (
                  <motion.div
                    key="discount"
                    className="flex justify-between overflow-hidden"
                    style={{ color: sew.coral }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_DRAPE }}
                  >
                    <dt className="tracking-wide uppercase">Descuento 2º patrón</dt>
                    <dd>
                      −<Rolling value={discount} />
                    </dd>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-between text-[15px]">
                <dt className="tracking-wide uppercase" style={{ color: sew.inkSoft }}>
                  Total
                </dt>
                <dd className="font-medium">
                  <Rolling value={total} />
                </dd>
              </div>
            </dl>
            <ScissorsBuyButton
              className="mt-4"
              price={total}
              onCheckout={() => onCheckout?.(total)}
            />
            <p className="mt-3 text-center text-[11px]" style={{ color: sew.inkSoft }}>
              Entrega digital inmediata tras el pago. Pago seguro.
            </p>
            {notice}
          </footer>
        </>
      )}
    </section>
  );
}

/** Hilo que va de la bobina a la aguja: marca lo que falta para el descuento. */
function ThreadPromo({
  units,
  eligible,
  percent,
}: {
  units: number;
  eligible: boolean;
  percent: number;
}) {
  const progress = Math.min(1, units / 2);
  return (
    <div className="mx-6 mt-4 rounded-xl px-4 py-3" style={{ backgroundColor: sew.creamDim }}>
      <div className="flex items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={eligible ? "on" : "off"}
            className="text-[12px] leading-snug"
            style={{ color: sew.inkSoft }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {eligible ? (
              <>¡Descuento aplicado al patrón más económico!</>
            ) : (
              <>
                Añade otro patrón y el más económico tiene un{" "}
                <strong style={{ color: sew.coral }}>{percent} % de descuento</strong>.
              </>
            )}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence>{eligible && <SewnTag key="tag" percent={percent} />}</AnimatePresence>
      </div>

      <div className="relative mt-2.5 flex items-center gap-2">
        {/* Bobina. */}
        <svg
          viewBox="0 0 20 22"
          className="size-5 shrink-0"
          fill="none"
          stroke={sew.ink}
          strokeWidth={1.4}
          aria-hidden
        >
          <rect x={2} y={1} width={16} height={3} rx={1.2} />
          <rect x={2} y={18} width={16} height={3} rx={1.2} />
          <rect x={4.5} y={4} width={11} height={14} fill={sew.thread} stroke="none" />
          <path
            d="M4.5 8h11M4.5 12h11M4.5 15h11"
            stroke={sew.cream}
            strokeWidth={0.8}
            opacity={0.6}
          />
        </svg>
        <div className="relative h-5 flex-1">
          <span
            className="absolute inset-x-0 top-1/2 h-px"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${sew.line} 0 4px, transparent 4px 7px)`,
            }}
          />
          <motion.span
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 rounded-full"
            style={{ backgroundColor: sew.thread }}
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.6, ease: EASE_STITCH }}
          />
          {/* Aguja al final del hilo. */}
          <motion.span
            className="absolute top-1/2 block -translate-y-1/2"
            initial={false}
            animate={{ left: `calc(${progress * 100}% - 20px)` }}
            transition={{ duration: 0.6, ease: EASE_STITCH }}
          >
            <svg viewBox="0 0 22 8" width={22} height={8} aria-hidden>
              <path d="M1 4 L16 2.5 Q21 4 16 5.5 Z" fill={sew.inkSoft} />
              <ellipse cx={15} cy={4} rx={1.6} ry={0.7} fill={sew.creamDim} />
            </svg>
          </motion.span>
        </div>
        <span className="ml-1 text-[10px]" style={{ fontFamily: sew.mono, color: sew.inkSoft }}>
          {Math.min(units, 2)}/2
        </span>
      </div>
    </div>
  );
}

/** Etiqueta coral que se cose: su pespunte se dibuja alrededor. */
function SewnTag({ percent }: { percent: number }) {
  return (
    <motion.span
      className="relative shrink-0 rounded-md px-2.5 py-1 text-[12px] font-semibold"
      style={{ backgroundColor: sew.coral, color: sew.paper, fontFamily: sew.mono }}
      initial={{ scale: 1.6, rotate: -14, opacity: 0 }}
      animate={{ scale: 1, rotate: -4, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE_DRAPE }}
    >
      −{percent} %
      <svg
        className="pointer-events-none absolute inset-[2.5px] overflow-visible"
        width="calc(100% - 5px)"
        height="calc(100% - 5px)"
        style={{ width: "calc(100% - 5px)", height: "calc(100% - 5px)" }}
        aria-hidden
      >
        <motion.rect
          width="100%"
          height="100%"
          rx={3}
          fill="none"
          stroke={sew.paper}
          strokeWidth={1}
          strokeDasharray="3 2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE_STITCH }}
        />
      </svg>
    </motion.span>
  );
}

function CartRow({
  item,
  removing,
  onQty,
  onRemove,
}: {
  item: SewingCartItem;
  removing: boolean;
  onQty: (qty: number) => void;
  onRemove: () => void;
}) {
  const [direction, setDirection] = useState(1);
  const change = (delta: number) => {
    setDirection(delta);
    onQty(item.qty + delta);
  };
  return (
    <motion.li
      className="relative overflow-hidden"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease: EASE_DRAPE }}
    >
      <motion.div
        className="flex gap-3 py-4"
        animate={removing ? { x: 36, opacity: 0, rotate: 1.5 } : { x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.35, ease: "easeIn" }}
      >
        <Envelope icon={item.icon ?? "tote"} />
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[15px] leading-tight font-medium"
            style={{ fontFamily: sew.display }}
          >
            {item.name}
          </p>
          {item.subtitle && (
            <p className="truncate text-[11px]" style={{ color: sew.inkSoft }}>
              {item.subtitle}
            </p>
          )}
          <p className="mt-0.5 text-[11px]" style={{ fontFamily: sew.mono, color: sew.inkSoft }}>
            {euros(item.price)} · unidad
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-full border px-2 py-1"
              style={{ borderColor: sew.line }}
            >
              <QtyButton label="Quitar una unidad" onClick={() => change(-1)}>
                <path d="M6 12h12" />
              </QtyButton>
              <span
                className="relative h-4 w-4 overflow-hidden text-center text-[12px] leading-4"
                style={{ fontFamily: sew.mono }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={item.qty}
                    className="absolute inset-0"
                    initial={{ y: direction * 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: direction * -14, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.qty}
                  </motion.span>
                </AnimatePresence>
              </span>
              <QtyButton label="Añadir una unidad" onClick={() => change(1)}>
                <path d="M6 12h12M12 6v12" />
              </QtyButton>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="cursor-pointer text-[11px] tracking-wide uppercase underline underline-offset-2 transition-colors hover:text-(--sew-coral)"
              style={{
                fontFamily: sew.mono,
                color: sew.inkSoft,
                ["--sew-coral" as string]: sew.coral,
              }}
            >
              Quitar
            </button>
          </div>
        </div>
        <Rolling value={item.price * item.qty} className="text-[13px] whitespace-nowrap" />
      </motion.div>

      {/* Costura de la fila: al quitar el patrón se descose de derecha a izquierda. */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 bottom-0 block h-[1.5px] origin-left"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${removing ? sew.coral : sew.line} 0 5px, transparent 5px 9px)`,
        }}
        initial={false}
        animate={{ scaleX: removing ? 0 : 1 }}
        transition={{ duration: 0.4, ease: EASE_STITCH }}
      />
    </motion.li>
  );
}

function QtyButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.8 }}
      className="grid size-4 cursor-pointer place-items-center"
      style={{ color: sew.inkSoft }}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[13px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        aria-hidden
      >
        {children}
      </svg>
    </motion.button>
  );
}

/** Sobre del patrón con el dibujo de la prenda asomando. */
function Envelope({ icon }: { icon: GarmentIconName }) {
  return (
    <div
      className="relative h-[68px] w-14 shrink-0 overflow-hidden rounded-lg border"
      style={{ borderColor: sew.line, backgroundColor: sew.paper }}
      aria-hidden
    >
      <div
        className="absolute inset-x-1 top-1 bottom-4 grid place-items-center rounded-sm"
        style={{ backgroundColor: sew.denim, color: sew.thread }}
      >
        <GarmentIcon icon={icon} className="size-10" />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-5"
        style={{
          backgroundColor: sew.creamDim,
          clipPath: "polygon(0 35%, 50% 0, 100% 35%, 100% 100%, 0 100%)",
        }}
      />
      <span
        className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full"
        style={{ backgroundColor: sew.coral }}
      />
    </div>
  );
}

function EmptyBasket() {
  return (
    <svg
      viewBox="0 0 80 64"
      className="h-16 w-20"
      fill="none"
      stroke={sew.inkSoft}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 26h60l-6 30H16Z" />
      <path d="M22 26c0-10 8-16 18-16s18 6 18 16" />
      <path d="M14 36h52" strokeDasharray="3 4" />
      <circle cx={58} cy={12} r={4} stroke={sew.coral} />
      <path d="M58 16c-2 6-8 8-14 8" stroke={sew.coral} strokeDasharray="2 3" />
    </svg>
  );
}
