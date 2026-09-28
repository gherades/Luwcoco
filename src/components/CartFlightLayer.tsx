"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PatternIcon } from "./PatternIcon";
import { withBasePath } from "@/lib/basePath";
import { landInCart, subscribeFlights, type CartFlight } from "@/lib/cartFlight";

// La copia que vuela nunca pasa de este tamaño, aunque salga de una foto
// grande (la ficha de producto): despega centrada sobre la imagen original.
const MAX_SIZE = 180;
const LANDING_SIZE = 22;

type Flight = CartFlight & { to: { x: number; y: number } };

/**
 * Capa fija por encima de todo donde vuelan los productos hacia la bolsa del
 * header: suben, cruzan casi todo en horizontal, flotan y caen en la bolsa
 * mientras encogen.
 */
export function CartFlightLayer() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(
    () =>
      subscribeFlights((flight) => {
        const target = document.querySelector("[data-cart-target]");
        if (!target) {
          landInCart(flight.product);
          return;
        }
        const rect = target.getBoundingClientRect();
        const to = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        setFlights((current) => [...current, { ...flight, to }]);
      }),
    [],
  );

  const land = (flight: Flight) => {
    setFlights((current) => current.filter((item) => item.key !== flight.key));
    landInCart(flight.product);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      {flights.map((flight) => (
        <FlyingProduct key={flight.key} flight={flight} onLand={() => land(flight)} />
      ))}
    </div>
  );
}

function FlyingProduct({ flight, onLand }: { flight: Flight; onLand: () => void }) {
  const { product, image } = flight;
  const box = useMemo(() => {
    const { x, y, w, h } = flight.from;
    const size = Math.min(MAX_SIZE, w, h);
    return { x: x + (w - size) / 2, y: y + (h - size) / 2, size };
  }, [flight.from]);

  const target = useMemo(() => {
    const dx = flight.to.x - (box.x + box.size / 2);
    const dy = flight.to.y - (box.y + box.size / 2);
    // La bolsa está arriba: el punto más alto queda por encima de ella sin
    // salirse de la pantalla, y desde ahí cae en vertical.
    const peak = Math.max(dy - 56, -(box.y + box.size / 2) + 12);
    return {
      x: [0, dx * 0.06, dx * 0.94, dx, dx],
      y: [0, -16, peak, peak + 8, dy],
      scale: [1, 1.08, 0.5, 0.42, LANDING_SIZE / box.size],
      rotate: [0, -6, 8, 5, 0],
    };
  }, [flight.to, box]);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-2xl border border-line bg-cream-dim shadow-xl"
      style={{ left: box.x, top: box.y, width: box.size, height: box.size }}
      initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
      animate={target}
      transition={{
        duration: 0.8,
        times: [0, 0.14, 0.5, 0.66, 1],
        ease: ["easeOut", "easeInOut", "linear", "easeIn"],
      }}
      onAnimationComplete={onLand}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={withBasePath(image)}
          alt=""
          className="size-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="grid size-full place-items-center bg-gradient-to-br from-denim/60 to-cream-dim">
          <PatternIcon icon={product.icon} className="size-3/4 text-ink/75" />
        </div>
      )}
    </motion.div>
  );
}
