"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutHero, aboutMission, aboutTrust } from "@/data/about";
import HoverText from "./HoverText";

/** Framer symbol #2930526878 — filled rating star (same as CustomerReviews). */
function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M 9.749 15.477 L 14.879 18.632 C 15.151 18.797 15.496 18.782 15.753 18.594 C 16.01 18.406 16.128 18.082 16.053 17.772 L 14.658 11.886 L 19.223 7.948 C 19.461 7.739 19.552 7.409 19.455 7.108 C 19.357 6.806 19.09 6.592 18.774 6.563 L 12.783 6.075 L 10.475 0.488 C 10.354 0.193 10.068 0 9.749 0 C 9.431 0 9.144 0.193 9.023 0.488 L 6.715 6.075 L 0.724 6.563 C 0.406 6.59 0.136 6.806 0.038 7.109 C -0.06 7.412 0.034 7.745 0.275 7.953 L 4.84 11.89 L 3.445 17.772 C 3.37 18.082 3.488 18.406 3.745 18.594 C 4.002 18.782 4.347 18.797 4.619 18.632 Z"
        transform="translate(2.25 2.625)"
      />
    </svg>
  );
}

/** Info “i” glyph — About Wearix eyebrow (Figma). */
function InfoIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="7.25" r="1.35" fill="currentColor" />
      <path
        d="M12 10.5v7"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

type StatIconName = (typeof aboutMission.stats)[number]["icon"];

/** Framer stat card icons — stroke 1.5, white on glass chip. */
function StatIcon({ name, size = 20 }: { name: StatIconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  if (name === "shirt") {
    return (
      <svg {...common}>
        <path
          d="M 0 7.5 L 2.657 7.5 C 2.95 7.503 3.22 7.343 3.36 7.086 L 5.167 3.635 C 5.352 3.276 5.213 2.835 4.854 2.648 L 0 0"
          transform="translate(18 3.75)"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 5.249 7.5 L 2.592 7.5 C 2.299 7.503 2.028 7.343 1.889 7.086 L 0.082 3.635 C -0.104 3.276 0.036 2.835 0.394 2.648 L 5.249 0"
          transform="translate(0.751 3.75)"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 9 0 C 9 1.657 7.657 3 6 3 C 4.343 3 3 1.657 3 0 L 0 0 L 0 15.75 C 0 16.164 0.336 16.5 0.75 16.5 L 11.25 16.5 C 11.664 16.5 12 16.164 12 15.75 L 12 0 Z"
          transform="translate(6 3.75)"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "user-check") {
    return (
      <svg {...common}>
        <path
          d="M 0 5.625 C 0 2.518 2.518 0 5.625 0 C 8.732 0 11.25 2.518 11.25 5.625 C 11.25 8.732 8.732 11.25 5.625 11.25 C 2.518 11.25 0 8.732 0 5.625 Z"
          transform="translate(4.5 3.75)"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 0 3.75 C 1.927 1.458 4.646 0 7.875 0 C 11.104 0 13.823 1.458 15.75 3.75"
          transform="translate(2.25 15)"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 0 1.5 L 1.5 3 L 4.5 0"
          transform="translate(18.75 12)"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "hanger") {
    return (
      <svg {...common}>
        <path
          d="M 7.498 3 C 7.498 1.343 8.841 0 10.498 0 C 12.155 0 13.498 1.343 13.498 3 L 0.3 12.9 C 0.042 13.093 -0.063 13.43 0.038 13.736 C 0.14 14.042 0.426 14.249 0.748 14.25 L 20.248 14.25 C 20.571 14.25 20.857 14.043 20.959 13.737 C 21.061 13.431 20.955 13.094 20.697 12.9 L 10.498 5.25"
          transform="translate(1.502 3.75)"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M 0 3 C 0 1.343 1.343 0 3 0 C 4.657 0 6 1.343 6 3 C 6 4.657 4.657 6 3 6 C 1.343 6 0 4.657 0 3 Z"
        transform="translate(3 5.25)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 3 C 0 1.343 1.343 0 3 0 C 4.657 0 6 1.343 6 3 C 6 4.657 4.657 6 3 6 C 1.343 6 0 4.657 0 3 Z"
        transform="translate(15 5.25)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 3.75 C 0 1.679 1.679 0 3.75 0 C 5.821 0 7.5 1.679 7.5 3.75 C 7.5 5.821 5.821 7.5 3.75 7.5 C 1.679 7.5 0 5.821 0 3.75 Z"
        transform="translate(8.25 9.75)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 2.25 C 0.39 0.741 1.87 -0.218 3.407 0.043 C 4.944 0.304 6.025 1.698 5.894 3.252 C 5.764 4.805 4.465 6 2.906 6"
        transform="translate(15.094 5.25)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 2.999 6 C 1.44 6 0.141 4.805 0.011 3.252 C -0.12 1.698 0.961 0.304 2.498 0.043 C 4.034 -0.218 5.515 0.741 5.905 2.25"
        transform="translate(3.001 5.25)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 C 1.771 -0.001 3.439 0.833 4.5 2.25"
        transform="translate(18 11.25)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 2.25 C 1.061 0.833 2.729 -0.001 4.5 0"
        transform="translate(1.5 11.25)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 3 C 1.095 1.141 3.092 0 5.25 0 C 7.408 0 9.405 1.141 10.5 3"
        transform="translate(6.75 17.25)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-hero-heading">
      <div className="about-hero__media">
        <Image
          src={aboutHero.image}
          alt={aboutHero.imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="about-hero__image"
          unoptimized
        />
      </div>
      <div className="about-hero__overlay" aria-hidden="true" />

      <div className="about-hero__content">
        <div className="about-hero__copy">
          <div className="about-hero__chip">
            <span className="about-hero__chip-pill">{aboutHero.eyebrowPill}</span>
            <span className="about-hero__chip-label">{aboutHero.eyebrowLabel}</span>
          </div>

          <h1 id="about-hero-heading" className="about-hero__heading">
            {aboutHero.heading}
          </h1>

          <p className="about-hero__text">{aboutHero.body}</p>

          <div className="about-hero__actions">
            <Link
              href={aboutHero.primaryCta.href}
              className="about-hero__btn about-hero__btn--solid"
            >
              <HoverText>{aboutHero.primaryCta.label}</HoverText>
            </Link>
            <Link
              href={aboutHero.secondaryCta.href}
              className="about-hero__btn about-hero__btn--glass"
            >
              <HoverText>{aboutHero.secondaryCta.label}</HoverText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutTrust() {
  const logos = [...aboutTrust.logos, ...aboutTrust.logos];

  return (
    <section className="about-trust" aria-label="Social proof">
      <div className="about-trust__inner">
        <div className="about-trust__proof">
          <div className="about-trust__avatars" aria-hidden="true">
            {aboutTrust.avatars.map((src) => (
              <span key={src} className="about-trust__avatar">
                <Image src={src} alt="" width={36} height={36} unoptimized />
              </span>
            ))}
          </div>

          <div className="about-trust__meta">
            <div className="about-trust__rating-row">
              <span className="about-trust__stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} size={14} />
                ))}
              </span>
              <p className="about-trust__rating">
                <span>{aboutTrust.rating}</span> {aboutTrust.ratingLabel}
              </p>
            </div>
            <p className="about-trust__trusted">{aboutTrust.trusted}</p>
          </div>
        </div>

        <div className="about-trust__marquee" aria-hidden="true">
          <div className="about-trust__marquee-track">
            {logos.map((logo, index) => (
              <span key={`${logo.src}-${index}`} className="about-trust__logo">
                <Image
                  src={logo.src}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  unoptimized
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutMission() {
  return (
    <section className="about-mission" aria-labelledby="about-mission-heading">
      <div className="about-mission__inner">
        <header className="about-mission__header">
          <span className="about-mission__eyebrow">
            <span className="about-mission__eyebrow-mark" aria-hidden="true">
              <InfoIcon size={14} />
            </span>
            <span className="about-mission__eyebrow-label">
              {aboutMission.eyebrow}
            </span>
          </span>

          <h2 id="about-mission-heading" className="about-mission__heading">
            {aboutMission.heading}
          </h2>
        </header>

        <ul className="about-mission__stats">
          {aboutMission.stats.map((stat) => (
            <li key={stat.id} className="about-mission__card">
              <Image
                src={stat.image}
                alt={stat.imageAlt}
                fill
                sizes="(max-width: 809.98px) 100vw, (max-width: 1199.98px) 50vw, 277px"
                className="about-mission__card-image"
                unoptimized
              />
              <div className="about-mission__card-mask" aria-hidden="true" />
              <div className="about-mission__card-content">
                <span className="about-mission__card-icon" aria-hidden="true">
                  <StatIcon name={stat.icon} />
                </span>
                <div className="about-mission__card-text">
                  <p className="about-mission__card-value">{stat.value}</p>
                  <p className="about-mission__card-label">{stat.label}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTrust />
      <AboutMission />
    </>
  );
}
