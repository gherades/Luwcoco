import Link from "next/link";
import { CookiePreferencesLink } from "./CookiePreferencesLink";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-dim">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <span className="font-display text-2xl font-semibold">luwcoco</span>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Patrones digitales de costura hechos con cariño desde mi
              estudio. Anímate a coser conmigo.
            </p>
            <div className="mt-5 flex gap-4 text-ink-soft">
              <Link href="#" aria-label="Instagram" className="hover:text-ink">
                <InstagramIcon />
              </Link>
              <Link href="#" aria-label="TikTok" className="hover:text-ink">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.6 5.1c-.9-.8-1.5-2-1.6-3.1h-3.2v13.7c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .6 0 .9.1V9.6c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V8.4c1.2.9 2.7 1.4 4.3 1.4V6.6c-.9 0-1.9-.3-2.6-1.5Z"/>
                </svg>
              </Link>
              <Link href="#" aria-label="YouTube" className="hover:text-ink">
                <YoutubeIcon />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
              Suscríbete
            </h3>
            <p className="mt-3 text-sm text-ink-soft">
              No te pierdas ninguna novedad ni patrón nuevo.
            </p>
            <form className="mt-4 flex overflow-hidden rounded-full border border-line bg-cream">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-ink-soft/70"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-ink px-4 text-sm font-medium text-cream transition-colors hover:bg-thread-dark"
              >
                Enviar
              </button>
            </form>
          </div>

          <div className="text-sm text-ink-soft">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="#" className="hover:text-ink">Política de reembolso</Link></li>
              <li><Link href="#" className="hover:text-ink">Política de privacidad</Link></li>
              <li><Link href="#" className="hover:text-ink">Términos del servicio</Link></li>
              <CookiePreferencesLink />
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row">
          <span>© {new Date().getFullYear()} Luwcoco — Aprende a coser conmigo</span>
          <span>Demo de diseño · no es una tienda real</span>
        </div>
      </div>
    </footer>
  );
}
