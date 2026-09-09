import Link from "next/link";
import { bestSellers } from "@/data/products";
import HoverText from "./HoverText";
import ProductCard, { CrownIcon } from "./ProductCard";

export default function BestSellers() {
  return (
    <section className="best-sellers" aria-labelledby="best-sellers-heading">
      <div className="best-sellers__inner">
        <div className="best-sellers__header">
          <div className="best-sellers__copy">
            <span className="best-sellers__eyebrow">
              <span className="best-sellers__eyebrow-mark" aria-hidden="true">
                <CrownIcon size={14} strokeWidth={1.8} />
              </span>
              <span className="best-sellers__eyebrow-label">Best sellers</span>
            </span>
            <h2 id="best-sellers-heading" className="best-sellers__heading">
              Our signature best selling pieces
            </h2>
          </div>

          <Link href="/shop" className="best-sellers__cta">
            <HoverText>See all collections</HoverText>
          </Link>
        </div>

        <div className="best-sellers__grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
