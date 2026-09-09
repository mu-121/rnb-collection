import Link from "next/link";
import { collections } from "@/data/collections";
import HoverText from "./HoverText";
import CollectionCard from "./CollectionCard";

/** Framer layers/stack glyph (symbol #3580097749) — Collections eyebrow. */
function LayersIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 0.75 12 C 0.336 12 0 11.664 0 11.25 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 14.25 0 C 14.664 0 15 0.336 15 0.75 L 15 11.25 C 15 11.664 14.664 12 14.25 12 Z"
        transform="translate(3 7.5)"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 14.25 0 C 14.664 0 15 0.336 15 0.75 L 15 12"
        transform="translate(6 4.5)"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Collections() {
  return (
    <section className="collections" aria-labelledby="collections-heading">
      <div className="collections__inner">
        <div className="collections__header">
          <div className="collections__intro">
            <span className="collections__eyebrow">
              <span className="collections__eyebrow-mark" aria-hidden="true">
                <LayersIcon size={14} />
              </span>
              <span className="collections__eyebrow-label">Our Collections</span>
            </span>
            <h2 id="collections-heading" className="collections__heading">
              Modern collections defined by simplicity
            </h2>
          </div>

          <Link href="/shop" className="collections__cta">
            <HoverText>Shop all items</HoverText>
          </Link>
        </div>

        <div className="collections__list">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
