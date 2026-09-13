"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const remote = current?.startsWith("http");

  if (!images.length) return null;

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image
          key={current}
          src={current}
          alt={`${name} — image ${active + 1}`}
          fill
          sizes="(max-width: 809.98px) 100vw, (max-width: 1199.98px) 55vw, 640px"
          className="product-gallery__main-image"
          priority
          unoptimized={remote}
        />
      </div>

      {images.length > 1 ? (
        <ul className="product-gallery__thumbs" aria-label="Product images">
          {images.map((src, index) => {
            const isRemote = src.startsWith("http");
            return (
              <li key={`${src}-${index}`}>
                <button
                  type="button"
                  className={`product-gallery__thumb${
                    index === active ? " is-active" : ""
                  }`}
                  onClick={() => setActive(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === active}
                >
                  <Image
                    src={src}
                    alt=""
                    width={120}
                    height={160}
                    className="product-gallery__thumb-image"
                    unoptimized={isRemote}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
