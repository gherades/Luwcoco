import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { privacySections } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Política de privacidad — Luwcoco",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <FadeIn>
        <h1 className="font-display text-4xl font-medium">
          Política de privacidad
        </h1>
      </FadeIn>

      <div className="mt-10 space-y-10">
        {privacySections.map((section, i) => (
          <FadeIn key={section.heading} delay={Math.min(i * 0.03, 0.3)}>
            <h2 className="font-display text-xl font-medium">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
