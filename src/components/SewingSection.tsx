import type { ReactNode } from "react";
import { SewingDoodle } from "./SewingDoodle";
import { StitchReveal } from "./StitchReveal";

export function SewingSection({
  icon,
  side,
  rotate,
  delay = 0.1,
  colorClassName,
  children,
}: {
  icon: ReactNode;
  side: "left" | "right";
  rotate: number;
  delay?: number;
  colorClassName: string;
  children: ReactNode;
}) {
  const sideClassName = side === "left" ? "lg:-left-14" : "lg:-right-16";

  return (
    <div className="relative">
      <SewingDoodle
        rotate={rotate}
        delay={delay}
        className={`mb-3 flex justify-center ${colorClassName} lg:hidden`}
      >
        {icon}
      </SewingDoodle>
      <SewingDoodle
        rotate={rotate}
        delay={delay}
        className={`absolute top-0 hidden ${colorClassName} lg:block ${sideClassName}`}
      >
        {icon}
      </SewingDoodle>
      <StitchReveal delay={delay}>
        <div className="text-ink-soft">{children}</div>
      </StitchReveal>
    </div>
  );
}
