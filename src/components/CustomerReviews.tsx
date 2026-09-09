"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";

/** Framer ranking/message glyph (symbol #2502757080) — Reviews eyebrow. */
function RankingIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 8.625 17.25 L 0.75 17.25 C 0.336 17.25 0 16.914 0 16.5 L 0 8.625 C 0 3.862 3.862 0 8.625 0 L 8.625 0 C 13.388 0 17.25 3.862 17.25 8.625 L 17.25 8.625 C 17.25 13.388 13.388 17.25 8.625 17.25 Z"
        transform="translate(3.75 3)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 6.375 0"
        transform="translate(9 10.5)"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d="M 0 0 L 6.375 0"
        transform="translate(9 13.5)"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Framer star glyph (symbol #2930526878) — filled rating star. */
function StarIcon({ size = 15 }: { size?: number }) {
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

function isRemote(src: string) {
  return src.startsWith("http");
}

export default function CustomerReviews() {
  const [active, setActive] = useState(0);
  const review = testimonials[active];

  const onTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next =
        (active + delta + testimonials.length) % testimonials.length;
      setActive(next);
      const tabs = event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="tab"]',
      );
      tabs[next]?.focus();
    },
    [active],
  );

  return (
    <section
      className="customer-reviews"
      aria-labelledby="customer-reviews-heading"
    >
      <div className="customer-reviews__inner">
        <div className="customer-reviews__header">
          <span className="customer-reviews__eyebrow">
            <span className="customer-reviews__eyebrow-mark" aria-hidden="true">
              <RankingIcon size={14} />
            </span>
            <span className="customer-reviews__eyebrow-label">
              Customer reviews
            </span>
          </span>

          <div className="customer-reviews__title-block">
            <h2
              id="customer-reviews-heading"
              className="customer-reviews__heading"
            >
              The voice of quality
            </h2>
            <p className="customer-reviews__intro">
              Experience the difference through the words of customers who value
              premium fabrics and timeless design.
            </p>
          </div>
        </div>

        <div className="customer-reviews__card">
          <div className="customer-reviews__rating" aria-label={review.reviewCountLabel}>
            <span className="customer-reviews__stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={15} />
              ))}
            </span>
            <span className="customer-reviews__rating-label">
              {review.reviewCountLabel}
            </span>
          </div>

          <div className="customer-reviews__test">
            <div className="customer-reviews__brand">
              <Image
                key={review.topLogo}
                src={review.topLogo}
                alt=""
                width={140}
                height={21}
                className="customer-reviews__brand-logo"
                unoptimized={isRemote(review.topLogo)}
              />
            </div>

            <blockquote className="customer-reviews__quote">
              <p>{review.quote}</p>
            </blockquote>
          </div>

          <div className="customer-reviews__profile">
            <Image
              key={review.avatar}
              src={review.avatar}
              alt={review.avatarAlt}
              width={52}
              height={51}
              className="customer-reviews__avatar"
              unoptimized={isRemote(review.avatar)}
            />
            <div className="customer-reviews__person">
              <p className="customer-reviews__name">{review.author}</p>
              <p className="customer-reviews__role">{review.role}</p>
            </div>
          </div>

          <div className="customer-reviews__logos-wrap">
            <div
              className="customer-reviews__logos"
              role="tablist"
              aria-label="Review brands"
              onKeyDown={onTabKeyDown}
            >
              {testimonials.map((item, index) => {
                const isActive = index === active;
                const src = isActive ? item.logoActive : item.logoInactive;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    tabIndex={isActive ? 0 : -1}
                    aria-selected={isActive}
                    aria-label={`Show review by ${item.author}`}
                    className={
                      isActive
                        ? "customer-reviews__logo-tab customer-reviews__logo-tab--active"
                        : "customer-reviews__logo-tab"
                    }
                    onClick={() => setActive(index)}
                  >
                    <Image
                      src={src}
                      alt=""
                      width={107}
                      height={16}
                      className="customer-reviews__logo-img"
                      unoptimized={isRemote(src)}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
