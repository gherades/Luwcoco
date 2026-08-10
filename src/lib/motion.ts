// Sistema de dos curvas: "Puntada" para cualquier cosa que literalmente se
// está cosiendo (hilo, aguja), "Caída" para cualquier cosa con comportamiento
// de tela (tarjetas, textos, elementos que aparecen).
export const EASE_STITCH = "linear" as const;
export const EASE_DRAPE = [0.22, 1.24, 0.36, 1] as const;
