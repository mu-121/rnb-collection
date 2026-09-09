import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blog";
import HoverText from "./HoverText";

/** Framer voice/spiral glyph (symbol #3242964309) — Blog eyebrow. */
function VoiceIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 14.25 4.28 C 13.299 1.808 11.303 0 7.5 0 C 1.5 0 0 4.5 0 9 C 0 13.5 1.5 18 7.5 18 C 12 18 14.25 15 14.25 12.75 C 14.25 6.75 4.5 6.75 4.5 11.25 C 4.5 15 11.25 15 11.25 9 C 11.25 3.75 6 3.75 4.5 6"
        transform="translate(4.5 3)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Framer clock glyph (symbol #1727193461) — read time. */
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

/** Framer calendar glyph (symbol #2588847244) — post date. */
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
}: {
  readTime: string;
  date: string;
}) {
  return (
    <div className="blog__meta">
      <span className="blog__meta-item">
        <ClockIcon size={18} />
        <span>{readTime}</span>
      </span>
      <span className="blog__meta-line" aria-hidden="true" />
      <span className="blog__meta-item">
        <CalendarIcon size={18} />
        <span>{date}</span>
      </span>
    </div>
  );
}

export default function Blog() {
  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];
  const rest = blogPosts.filter((p) => p.id !== featured.id);

  return (
    <section className="blog" aria-labelledby="blog-heading">
      <div className="blog__inner">
        <header className="blog__header">
          <div className="blog__copy">
            <span className="blog__eyebrow">
              <span className="blog__eyebrow-mark" aria-hidden="true">
                <VoiceIcon size={14} />
              </span>
              <span className="blog__eyebrow-label">Wearix Voice</span>
            </span>
            <h2 id="blog-heading" className="blog__heading">
              Elevating your daily style journey
            </h2>
          </div>

          <Link href="/blog" className="blog__cta">
            <HoverText>Read all blogs</HoverText>
          </Link>
        </header>

        <div className="blog__grid">
          <Link
            href={`/blog/${featured.slug}`}
            className="blog__card blog__card--featured"
          >
            <div className="blog__media blog__media--featured">
              <div className="blog__image-scale">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 575px"
                  className="blog__image blog__image--featured"
                />
              </div>
            </div>
            <div className="blog__body blog__body--featured">
              <div className="blog__body-top">
                <span className="blog__tag">{featured.category}</span>
                <div className="blog__heading-block">
                  <h3 className="blog__title blog__title--featured">
                    {featured.title}
                  </h3>
                  {featured.excerpt ? (
                    <p className="blog__excerpt">{featured.excerpt}</p>
                  ) : null}
                </div>
              </div>
              <PostMeta
                readTime={featured.readTime}
                date={featured.date}
              />
            </div>
          </Link>

          <div className="blog__secondary">
            {rest.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="blog__card blog__card--small"
              >
                <div className="blog__media blog__media--small">
                  <div className="blog__image-scale">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 283px"
                      className="blog__image"
                    />
                  </div>
                </div>
                <div className="blog__body blog__body--small">
                  <div className="blog__body-top">
                    <span className="blog__tag">{post.category}</span>
                    <h3 className="blog__title blog__title--small">
                      {post.title}
                    </h3>
                  </div>
                  <PostMeta
                    readTime={post.readTime}
                    date={post.date}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
