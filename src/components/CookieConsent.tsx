"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

type Choice = "accepted" | "rejected" | "custom";
type Prefs = { analytics: boolean };

const STORAGE_KEY = "luwcoco-cookie-consent";
const CHANGE_EVENT = "luwcoco-cookie-consent-changed";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function hasDecided() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

function hasDecidedServer() {
  // On the server/prerender we don't know yet — assume "decided" so the
  // banner never flashes in the static HTML; the client corrects this
  // right after hydration via useSyncExternalStore.
  return true;
}

export function CookieConsent() {
  const decided = useSyncExternalStore(subscribe, hasDecided, hasDecidedServer);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const visible = !decided;

  function save(choice: Choice, prefs: Prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, prefs, date: Date.now() }));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-cream p-6 shadow-xl">
        <h2 className="font-display text-lg font-medium">
          Consentimiento para el uso de cookies
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Usamos cookies propias y de terceros para recordar tus preferencias
          y entender cómo se usa esta demo. No las usaremos con fines de
          analítica a menos que las aceptes. Más información en nuestra{" "}
          <Link href="#" className="underline">
            Política de privacidad
          </Link>
          .
        </p>

        {managing && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-cream-dim px-4 py-3 text-sm">
            <span>Cookies analíticas</span>
            <button
              role="switch"
              aria-checked={analytics}
              onClick={() => setAnalytics((v) => !v)}
              className={`h-6 w-11 rounded-full transition-colors ${analytics ? "bg-thread" : "bg-line"}`}
            >
              <span
                className={`block h-5 w-5 translate-y-0.5 rounded-full bg-cream transition-transform ${analytics ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => save("accepted", { analytics: true })}
            className="flex-1 rounded-full border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-thread-dark"
          >
            Aceptar
          </button>
          <button
            onClick={() => save("rejected", { analytics: false })}
            className="flex-1 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
          >
            Rechazar
          </button>
        </div>

        {managing ? (
          <button
            onClick={() => save("custom", { analytics })}
            className="mt-3 text-sm font-medium underline underline-offset-2"
          >
            Guardar preferencias
          </button>
        ) : (
          <button
            onClick={() => setManaging(true)}
            className="mt-3 text-sm font-medium underline underline-offset-2"
          >
            Administrar preferencias
          </button>
        )}
      </div>
    </div>
  );
}
