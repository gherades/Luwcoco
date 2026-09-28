/**
 * Paleta cálida de taller de costura (papel, tinta, hilo azul, coral) para
 * los componentes de temática de costura. Cada color lee una variable CSS
 * (`--color-ink`, `--color-thread`…) y trae su valor por defecto, así que se
 * pueden retematizar definiendo esas variables, también en modo oscuro.
 */
export const sew = {
  cream: "var(--color-cream, #f3eee7)",
  creamDim: "var(--color-cream-dim, #ece3d3)",
  ink: "var(--color-ink, #292520)",
  inkSoft: "var(--color-ink-soft, #6b6255)",
  thread: "var(--color-thread, #3e6e8e)",
  threadDark: "var(--color-thread-dark, #274a63)",
  coral: "var(--color-coral, #bb5a2c)",
  line: "var(--color-line, #d9cdb8)",
  blush: "var(--color-blush, #e3b79e)",
  denim: "var(--color-denim, #d7e3ea)",
  paper: "var(--color-paper, #f7f3ec)",
  graphite: "var(--color-graphite, #201d1a)",
  display: "var(--font-fraunces), Fraunces, Georgia, serif",
  sans: "var(--font-inter), var(--font-geist-sans), system-ui, sans-serif",
  mono: "var(--font-jetbrains-mono), var(--font-geist-mono), ui-monospace, monospace",
} as const;

/** «Puntada»: todo lo que literalmente se está cosiendo (hilo, aguja). */
export const EASE_STITCH = "linear" as const;
/** «Caída»: todo lo que se comporta como tela (tarjetas, textos). */
export const EASE_DRAPE = [0.22, 1.24, 0.36, 1] as const;

/** Precio con el formato de la tienda: 9,95 €. */
export function euros(value: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}
