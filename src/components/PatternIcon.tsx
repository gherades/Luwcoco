import type { ReactElement } from "react";

const paths: Record<string, ReactElement> = {
  duffbag: (
    <>
      <ellipse cx="60" cy="70" rx="14" ry="26" transform="rotate(90 60 70)" />
      <path d="M28 46c0-11 14-11 32-11s32 0 32 11" />
      <path d="M28 94c0 11 14 11 32 11s32 0 32-11" />
      <path d="M46 35v-8a14 14 0 0 1 28 0v8" />
      <path d="M60 46v48" strokeDasharray="4 5" />
    </>
  ),
  totebag: (
    <>
      <path d="M30 48h60l-6 54H36z" />
      <path d="M44 48v-8a16 16 0 0 1 32 0v8" />
      <path d="M30 68h60" strokeDasharray="4 5" />
    </>
  ),
  pants: (
    <>
      <path d="M40 24h40l4 20-4 68h-12l-8-56-8 56H40l-4-68z" />
      <path d="M40 24c0 8 8 12 20 12s20-4 20-12" />
    </>
  ),
  top: (
    <>
      <path d="M42 30 24 42l10 14 8-6v58h36V50l8 6 10-14-18-12c-4 6-12 10-18 10s-14-4-18-10z" />
    </>
  ),
  skirt: (
    <>
      <path d="M38 28h44l14 76H24z" />
      <path d="M38 28c0 6 10 10 22 10s22-4 22-10" />
      <path d="M60 40v64" strokeDasharray="4 5" />
    </>
  ),
  pouch: (
    <>
      <rect x="28" y="40" width="64" height="46" rx="6" />
      <path d="M28 50h64" />
      <circle cx="60" cy="45" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
};

export function PatternIcon({
  icon,
  className,
  animated = false,
}: {
  icon: keyof typeof paths;
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <g className={animated ? "stitch-line" : undefined}>{paths[icon]}</g>
    </svg>
  );
}
