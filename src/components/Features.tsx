"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { features } from "@/data/features";
import { FeatureTagIcon, tagIconKey } from "./FeatureTagIcon";

/** Framer bag glyph (symbol #2920620729) — Styles & Wear eyebrow. */
function BagIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 13.5 13.5 L 13.5 15.75 C 13.5 16.164 13.836 16.5 14.25 16.5 L 16.741 16.5 C 17.079 16.5 17.375 16.273 17.464 15.947 L 19.474 8.579 C 19.531 8.37 19.495 8.146 19.375 7.966 L 14.286 0.334 C 14.147 0.125 13.913 0 13.662 0 L 5.838 0 C 5.587 0 5.354 0.125 5.215 0.334 L 0.126 7.969 C 0.006 8.149 -0.031 8.373 0.026 8.582 L 2.036 15.947 C 2.125 16.273 2.421 16.5 2.759 16.5 L 5.25 16.5 C 5.664 16.5 6 16.164 6 15.75 L 6 13.5"
        transform="translate(2.25 3.75)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 5.25 3.094 L 10.5 0 L 10.5 11.344 C 10.5 11.758 10.164 12.094 9.75 12.094 L 0.75 12.094 C 0.336 12.094 0 11.758 0 11.344 L 0 0 Z"
        transform="translate(6.75 5.156)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 0 4.634"
        transform="translate(13.5 7.366)"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d="M 0 0 L 0 5.384"
        transform="translate(10.5 7.366)"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = [
      ...section.querySelectorAll<HTMLElement>(".features__card"),
    ];
    const done = new Set<HTMLElement>();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      const vh = window.innerHeight;
      for (const card of cards) {
        if (done.has(card)) {
          card.style.opacity = "1";
          card.style.transform = "none";
          continue;
        }
        const top = card.getBoundingClientRect().top;
        // Scroll-linked appear (matches live viewport progress).
        const start = vh * 0.98;
        const end = vh * 0.55;
        const p = Math.min(1, Math.max(0, (start - top) / (start - end)));
        card.style.opacity = String(p);
        if (reduce) {
          card.style.transform = "none";
        } else {
          card.style.transform = `translateY(${(1 - p) * 50}px)`;
        }
        if (p >= 1) done.add(card);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="features"
      aria-labelledby="features-heading"
    >
      <div className="features__inner">
        <header className="features__header">
          <span className="features__eyebrow">
            <span className="features__eyebrow-mark" aria-hidden="true">
              <BagIcon size={14} />
            </span>
            <span className="features__eyebrow-label">What defines our wear</span>
          </span>

          <div className="features__title-block">
            <h2 id="features-heading" className="features__heading">
              Where style meets ease
            </h2>
            <p className="features__intro">
              Thoughtful design blending modern style, comfort, and versatility
              for everyday living across lifestyles.
            </p>
          </div>
        </header>

        <div className="features__grid">
          {features.map((feature) => (
            <article key={feature.id} className="features__card">
              <div className="features__card-body">
                <div className="features__images" aria-hidden="true">
                  <div className="features__image features__image--left">
                    <Image
                      src={feature.images[0]}
                      alt=""
                      width={140}
                      height={186}
                      className="features__image-img"
                    />
                  </div>
                  <div className="features__image features__image--right">
                    <Image
                      src={feature.images[1]}
                      alt=""
                      width={140}
                      height={186}
                      className="features__image-img"
                    />
                  </div>
                </div>

                <div className="features__meta">
                  <div className="features__copy">
                    <h3 className="features__title">{feature.title}</h3>
                    <div className="features__divider" aria-hidden="true" />
                    <p className="features__description">{feature.description}</p>
                  </div>

                  <ul className="features__tags">
                    {feature.tags.map((tag) => (
                      <li key={tag} className="features__tag">
                        <span className="features__tag-icon" aria-hidden="true">
                          <FeatureTagIcon name={tagIconKey(tag)} size={14} />
                        </span>
                        <span className="features__tag-label">{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
