"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  shopFilters,
  shopHero,
  shopProducts,
  type ShopWear,
} from "@/data/shop";
import ProductCard from "./ProductCard";
import HoverText from "./HoverText";

function ShopHero() {
  return (
    <section className="shop-hero" aria-labelledby="shop-hero-heading">
      <div className="shop-hero__media">
        <Image
          src={shopHero.image}
          alt={shopHero.imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="shop-hero__image"
          unoptimized
        />
      </div>
      <div className="shop-hero__overlay" aria-hidden="true" />

      <div className="shop-hero__content">
        <div className="shop-hero__copy">
          <div className="shop-hero__chip">
            <span className="shop-hero__chip-pill">{shopHero.eyebrowPill}</span>
            <span className="shop-hero__chip-label">{shopHero.eyebrowLabel}</span>
          </div>

          <h1 id="shop-hero-heading" className="shop-hero__heading">
            {shopHero.heading}
          </h1>

          <p className="shop-hero__text">{shopHero.body}</p>

          <div className="shop-hero__actions">
            <Link
              href={shopHero.primaryCta.href}
              className="shop-hero__btn shop-hero__btn--solid"
            >
              <HoverText>{shopHero.primaryCta.label}</HoverText>
            </Link>
            <Link
              href={shopHero.secondaryCta.href}
              className="shop-hero__btn shop-hero__btn--glass"
            >
              <HoverText>{shopHero.secondaryCta.label}</HoverText>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopCatalog() {
  // LIVE category tabs update active state only — product set stays full catalog (20).
  const [wear, setWear] = useState<ShopWear>("all");

  return (
    <section className="shop-catalog" aria-labelledby="shop-catalog-heading">
      <h2 id="shop-catalog-heading" className="shop-catalog__sr-only">
        Shop products
      </h2>

      <div className="shop-catalog__inner">
        <div
          className="shop-filters"
          role="tablist"
          aria-label="Product categories"
        >
          {shopFilters.map((filter) => {
            const active = wear === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={
                  active
                    ? "shop-filters__tab shop-filters__tab--active"
                    : "shop-filters__tab"
                }
                onClick={() => setWear(filter.id)}
              >
                <HoverText>{filter.label}</HoverText>
              </button>
            );
          })}
        </div>

        <div className="shop-grid" data-filter={wear} data-count={shopProducts.length}>
          {shopProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShopHeroSection() {
  return <ShopHero />;
}

export function ShopCatalogSection() {
  return <ShopCatalog />;
}

export default function ShopPage() {
  return (
    <>
      <ShopHero />
      <ShopCatalog />
    </>
  );
}
