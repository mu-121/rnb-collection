import Link from "next/link";
import HoverText from "./HoverText";
import ProductCard, { SparkleIcon } from "./ProductCard";
import CatalogEmpty from "./CatalogEmpty";
import { fetchActiveProducts, pickNewArrivals } from "@/lib/catalog";

export default async function NewArrivals() {
  let products: Awaited<ReturnType<typeof pickNewArrivals>> = [];
  try {
    products = pickNewArrivals(await fetchActiveProducts({ limit: 100 }));
  } catch {
    products = [];
  }

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
          {products.length ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <CatalogEmpty
              title="No new arrivals yet"
              body="Fresh pieces will appear here as soon as they are published from the admin panel."
              href="/shop"
              cta="See all collections"
            />
          )}
        </div>
      </div>
    </section>
  );
}
