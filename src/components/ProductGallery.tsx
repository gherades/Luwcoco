"use client";

import { useState } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

export function ProductGallery({
  photoImage,
  gallery = [],
  productName,
}: {
  photoImage: string;
  gallery?: string[];
  productName: string;
}) {
  const images = [photoImage, ...gallery];
  const [active, setActive] = useState(0);

  return (
    <div className="mt-6">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-cream-dim">
        <Image
          src={withBasePath(images[active])}
          alt={`${productName} — foto del patrón terminado`}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-colors sm:h-20 sm:w-20 ${
                active === i ? "border-ink" : "border-line hover:border-ink/40"
              }`}
              aria-label={`Ver foto ${i + 1} de ${productName}`}
            >
              <Image
                src={withBasePath(img)}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
