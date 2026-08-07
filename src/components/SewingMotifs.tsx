import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 60 60",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function NeedleThread(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M10 50 30 30" />
      <rect x="27" y="14" width="9" height="20" rx="4" transform="rotate(45 31.5 24)" />
      <circle cx="34.5" cy="20.5" r="1.6" fill="currentColor" stroke="none" />
      <path d="M6 54c4-1 7-5 5-9-2-3-7-3-9 0" strokeDasharray="3 3" />
    </svg>
  );
}

export function ThreadSpool(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="30" cy="11" rx="13" ry="4.5" />
      <ellipse cx="30" cy="49" rx="13" ry="4.5" />
      <path d="M17 11v38M43 11v38" />
      <path d="M19 20c7 4 15 4 22 0M19 30c7 4 15 4 22 0M19 40c7 4 15 4 22 0" />
    </svg>
  );
}

export function ScissorsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="13" cy="13" r="6.5" />
      <circle cx="13" cy="47" r="6.5" />
      <path d="M18 17 48 44M18 43 48 16" />
    </svg>
  );
}

export function MeasuringTapeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="30" cy="30" r="22" />
      <path d="M30 10v5M30 45v5M10 30h5M45 30h5" />
      <path d="M16 16l3.5 3.5M44 16l-3.5 3.5M16 44l3.5-3.5M44 44l-3.5-3.5" />
      <circle cx="30" cy="30" r="4" />
    </svg>
  );
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="30" cy="14" r="7" />
      <path d="M30 21v32" />
    </svg>
  );
}
