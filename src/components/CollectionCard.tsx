"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/data/collections";
import HoverText from "./HoverText";

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

/** Object-position overrides matching live Framer Image 01 crops. */
const IMAGE_POSITION: Record<string, string> = {
  "/Images/wearix-113.png": "55.9% 0%",
  "https://framerusercontent.com/images/0g1kqNpbGUbeCR7eDqHjDWiv4s.png":
    "55.9% 0%",
};

type CollectionCardProps = {
  collection: Collection;
  reverse?: boolean;
};

export default function CollectionCard({
  collection,
  reverse = false,
}: CollectionCardProps) {
  // Live Image 01 = last entry in prepared arrays (Framer slide order)
  const slides = [...collection.images].reverse();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Live Framer slideshow: click-driven only (no autoplay observed / no enabledGestures auto-cycle)

  return (
    <article
      ref={cardRef}
      className={
        reverse
          ? "collections__card collections__card--reverse"
          : "collections__card"
      }
      data-visible={visible ? "true" : "false"}
    >
      <div className="collections__media">
        {slides.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={
              index === active ? `${collection.name} collection` : ""
            }
            fill
            sizes="(max-width: 809.98px) 100vw, (max-width: 1199.98px) 100vw, 567px"
            className="collections__image"
            style={{
              opacity: index === active ? 1 : 0,
              objectPosition: IMAGE_POSITION[src] ?? "50% 50%",
              transitionDuration: reduceMotion.current ? "0ms" : "400ms",
            }}
            priority={index === 0}
            unoptimized={src.startsWith("http")}
          />
        ))}

        <div
          className="collections__dots"
          role="tablist"
          aria-label={`${collection.name} image slides`}
        >
          {slides.map((_, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${collection.id}-dot-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show image ${index + 1} of ${slides.length}`}
                className={
                  isActive
                    ? "collections__dot collections__dot--active"
                    : "collections__dot"
                }
                onClick={() => setActive(index)}
              />
            );
          })}
        </div>
      </div>

      <div className="collections__panel">
        <div className="collections__copy">
          <div className="collections__chip">
            <span className="collections__chip-badge">{collection.badge}</span>
            <span className="collections__chip-name">{collection.name}</span>
          </div>

          <div className="collections__heading-block">
            <h3 className="collections__title">{collection.title}</h3>
            <p className="collections__desc">{collection.description}</p>
          </div>
        </div>

        <div className="collections__pricing">
          <div className="collections__pricing-info">
            <span className="collections__pricing-icon" aria-hidden="true">
              <Image
                src="/Images/dollar.svg"
                alt=""
                width={28}
                height={28}
              />
            </span>
            <div className="collections__pricing-text">
              <span className="collections__pricing-label">
                Pricing start from:
              </span>
              <div className="collections__prices">
                <span className="collections__price">
                  {formatPrice(collection.priceFrom)}
                </span>
                <span className="collections__price-sep" aria-hidden="true">
                  —
                </span>
                <span className="collections__price">
                  {formatPrice(collection.priceTo)}
                </span>
              </div>
            </div>
          </div>

          <Link href="/shop" className="collections__all">
            <HoverText>All collections</HoverText>
          </Link>
        </div>
      </div>
    </article>
  );
}
