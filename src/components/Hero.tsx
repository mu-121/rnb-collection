"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { assets } from "@/data/assets";
import HoverText from "./HoverText";

const SLIDE_LABELS = [
  "Urban",
  "Latest",
  "Premium",
  "Arctic",
  "Casual",
  "Iconic",
  "Unique",
] as const;

/** Autoplay interval — exact Framer timing unknown; 4s chosen to match calm fashion pace. */
const AUTOPLAY_MS = 4000;

const slides = assets.heroCarousel.map((src, index) => ({
  src,
  label: SLIDE_LABELS[index] ?? `Slide ${index + 1}`,
  alt: `Wearix lookbook — ${SLIDE_LABELS[index] ?? `slide ${index + 1}`}`,
}));

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Hero lookbook"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="hero__media" aria-live="polite">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className="hero__slide"
            data-active={index === active}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              quality={85}
            />
          </div>
        ))}
      </div>

      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <div className="hero__copy">
          <div className="hero__tags" aria-label="Collection tags">
            <span className="hero__tag">Soft</span>
            <span className="hero__tag hero__tag--plain">Warm Winter Layers</span>
          </div>

          <div className="hero__heading-block">
            <h1 className="hero__heading">Premium wear for modern living</h1>

            <p className="hero__text">
              Discover our new range of soft clothes made for your daily look and
              your best days with the finest fabrics.
            </p>
          </div>

          <div className="hero__actions">
            <Link href="/shop" className="hero__btn hero__btn--solid">
              <HoverText>See all collections</HoverText>
            </Link>
            <Link href="/contact" className="hero__btn hero__btn--glass">
              <HoverText>Contact us</HoverText>
            </Link>
          </div>
        </div>

        <div
          className="hero__carousel"
          role="tablist"
          aria-label="Hero slides"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className="hero__thumb"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show ${slide.label} look`}
              data-active={index === active}
              onClick={() => goTo(index)}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="140px"
                quality={70}
              />
              <span className="hero__thumb-label">{slide.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
