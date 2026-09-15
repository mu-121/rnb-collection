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
                  <Image
                    src={stat.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="about-mission__card-icon-img"
                  />
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
