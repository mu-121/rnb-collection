import Link from "next/link";
import { newArrivals } from "@/data/products";
import HoverText from "./HoverText";
import ProductCard, { SparkleIcon } from "./ProductCard";

export default function NewArrivals() {
  return (
    <section className="new-arrivals" aria-labelledby="new-arrivals-heading">
      <div className="new-arrivals__inner">
        <div className="new-arrivals__header">
          <div className="new-arrivals__copy">
            <span className="new-arrivals__eyebrow">
              <span className="new-arrivals__eyebrow-mark" aria-hidden="true">
                <SparkleIcon size={14} />
              </span>
              New Arrivals
            </span>
            <h2 id="new-arrivals-heading" className="new-arrivals__heading">
              Fresh fits in our latest drop
            </h2>
          </div>

          <Link href="/shop" className="new-arrivals__cta">
            <HoverText>See all collections</HoverText>
          </Link>
        </div>

        <div className="new-arrivals__grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
