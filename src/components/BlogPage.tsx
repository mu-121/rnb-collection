"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  blogPageFilters,
  blogPageHero,
  blogPagePosts,
  filterBlogPagePosts,
  type BlogPageCategory,
  type BlogPagePost,
} from "@/data/blog-page";
import HoverText from "./HoverText";

function isRemote(src: string) {
  return src.startsWith("http");
}

function ClockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 0 9 C 0 4.029 4.029 0 9 0 C 13.971 0 18 4.029 18 9 C 18 13.971 13.971 18 9 18 C 4.029 18 0 13.971 0 9 Z"
        transform="translate(3 3)"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 0 5.25 L 5.25 5.25"
        transform="translate(12 6.75)"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 0.75 16.5 C 0.336 16.5 0 16.164 0 15.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 15.75 0 C 16.164 0 16.5 0.336 16.5 0.75 L 16.5 15.75 C 16.5 16.164 16.164 16.5 15.75 16.5 Z"
        transform="translate(3.75 3.75)"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 0 3"
        transform="translate(16.5 2.25)"
        stroke="currentColor"
        strokeWidth={2.15}
        strokeLinecap="round"
      />
      <path
        d="M 0 0 L 0 3"
        transform="translate(7.5 2.25)"
        stroke="currentColor"
        strokeWidth={2.15}
        strokeLinecap="round"
      />
      <path
        d="M 0 0 L 16.5 0"
        transform="translate(3.75 8.25)"
        stroke="currentColor"
        strokeWidth={2.15}
        strokeLinecap="round"
      />
    </svg>
  );
}

function PostMeta({
  readTime,
  date,
  size = "small",
}: {
  readTime: string;
  date: string;
  size?: "featured" | "small";
}) {
  const icon = size === "featured" ? 18 : 16;
  return (
    <div
      className={
        size === "featured"
          ? "blog-card__meta blog-card__meta--featured"
          : "blog-card__meta"
      }
    >
      <span className="blog-card__meta-item">
        <ClockIcon size={icon} />
        <span>{readTime}</span>
      </span>
      <span className="blog-card__meta-line" aria-hidden="true" />
      <span className="blog-card__meta-item">
        <CalendarIcon size={icon} />
        <span>{date}</span>
      </span>
    </div>
  );
}

function BlogHero() {
  return (
    <section className="blog-hero" aria-labelledby="blog-hero-heading">
      <div className="blog-hero__media">
        <Image
          src={blogPageHero.image}
          alt={blogPageHero.imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="blog-hero__image"
          unoptimized
        />
      </div>
      <div className="blog-hero__overlay" aria-hidden="true" />

      <div className="blog-hero__content">
        <div className="blog-hero__copy">
          <div className="blog-hero__chip">
            <span className="blog-hero__chip-pill">
              {blogPageHero.eyebrowPill}
            </span>
            <span className="blog-hero__chip-label">
              {blogPageHero.eyebrowLabel}
            </span>
          </div>

          <h1 id="blog-hero-heading" className="blog-hero__heading">
            {blogPageHero.heading}
          </h1>

          <p className="blog-hero__text">{blogPageHero.body}</p>

          <div className="blog-hero__actions">
            <Link
              href={blogPageHero.primaryCta.href}
              className="blog-hero__btn blog-hero__btn--solid"
            >
              <HoverText>{blogPageHero.primaryCta.label}</HoverText>
            </Link>
            <Link
              href={blogPageHero.secondaryCta.href}
              className="blog-hero__btn blog-hero__btn--glass"
            >
              <HoverText>{blogPageHero.secondaryCta.label}</HoverText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ post }: { post: BlogPagePost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="blog-card blog-card--featured"
    >
      <div className="blog-card__media blog-card__media--featured">
        <div className="blog-card__image-scale">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 615px"
            className="blog-card__image"
            unoptimized={isRemote(post.image)}
          />
        </div>
      </div>
      <div className="blog-card__body blog-card__body--featured">
        <div className="blog-card__body-top">
          <span className="blog-card__tag">{post.category}</span>
          <div className="blog-card__heading-block">
            <h2 className="blog-card__title blog-card__title--featured">
              {post.title}
            </h2>
            {post.excerpt ? (
              <p className="blog-card__excerpt">{post.excerpt}</p>
            ) : null}
          </div>
        </div>
        <PostMeta readTime={post.readTime} date={post.date} size="featured" />
      </div>
    </Link>
  );
}

function SmallCard({ post }: { post: BlogPagePost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card blog-card--small">
      <div className="blog-card__media blog-card__media--small">
        <div className="blog-card__image-scale">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 304px"
            className="blog-card__image"
            unoptimized={isRemote(post.image)}
          />
        </div>
      </div>
      <div className="blog-card__body blog-card__body--small">
        <div className="blog-card__body-top">
          <span className="blog-card__tag">{post.category}</span>
          <h2 className="blog-card__title blog-card__title--small">
            {post.title}
          </h2>
        </div>
        <PostMeta readTime={post.readTime} date={post.date} />
      </div>
    </Link>
  );
}

function BlogCatalog() {
  const [category, setCategory] = useState<BlogPageCategory>("all");

  const { featured, rest } = useMemo(() => {
    const filtered = filterBlogPagePosts(category);
    const featuredPost =
      blogPagePosts.find((p) => p.featured) ?? blogPagePosts[0];
    const showFeatured = filtered.some((p) => p.id === featuredPost.id);
    return {
      featured: showFeatured ? featuredPost : null,
      rest: showFeatured
        ? filtered.filter((p) => p.id !== featuredPost.id)
        : filtered,
    };
  }, [category]);

  return (
    <section className="blog-page" aria-labelledby="blog-page-heading">
      <h2 id="blog-page-heading" className="blog-page__sr-only">
        Blog articles
      </h2>

      <div className="blog-page__inner">
        <div
          className="blog-filter"
          role="tablist"
          aria-label="Blog categories"
        >
          {blogPageFilters.map((filter) => {
            const active = category === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={
                  active
                    ? "blog-filter__tab blog-filter__tab--active"
                    : "blog-filter__tab"
                }
                onClick={() => setCategory(filter.id)}
              >
                <HoverText>{filter.label}</HoverText>
              </button>
            );
          })}
        </div>

        <div className="blog-items">
          {featured ? <FeaturedCard post={featured} /> : null}
          <div
            className="blog-grid"
            data-filter={category}
            data-count={rest.length + (featured ? 1 : 0)}
          >
            {rest.map((post) => (
              <SmallCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BlogHeroSection() {
  return <BlogHero />;
}

export function BlogCatalogSection() {
  return <BlogCatalog />;
}
