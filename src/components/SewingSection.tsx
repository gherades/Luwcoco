import type { ReactNode } from "react";
import { SewingDoodle } from "./SewingDoodle";
import { FadeIn } from "./FadeIn";

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
      <FadeIn delay={delay} className="text-ink-soft">
        {children}
      </FadeIn>
    </div>
  );
}
