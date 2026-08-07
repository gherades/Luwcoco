"use client";

import { useState } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

export function ProductGallery({
  photoImage,
  gallery = [],
  instructionsImage,
  productName,
}: {
  photoImage: string;
  gallery?: string[];
  instructionsImage?: string;
  productName: string;
}) {
  const images = [photoImage, ...gallery, ...(instructionsImage ? [instructionsImage] : [])];
  const [active, setActive] = useState(0);
  const isDocument = images[active] === instructionsImage;

  return (
    <div className="mt-6">
      <div
        className={`relative aspect-square overflow-hidden rounded-3xl border border-line ${
          isDocument ? "bg-white" : "bg-cream-dim"
        }`}
      >
        <Image
          src={withBasePath(images[active])}
          alt={
            isDocument
              ? `Instrucciones y materiales del patrón ${productName}`
              : `${productName} — foto del patrón terminado`
          }
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className={isDocument ? "object-contain p-2" : "object-cover"}
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
              } ${img === instructionsImage ? "bg-white" : ""}`}
              aria-label={`Ver foto ${i + 1} de ${productName}`}
            >
              <Image
                src={withBasePath(img)}
                alt=""
                fill
                sizes="80px"
                className={img === instructionsImage ? "object-contain p-0.5" : "object-cover"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
