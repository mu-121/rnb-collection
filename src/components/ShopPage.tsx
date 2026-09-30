"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shopHero } from "@/data/shop";
import type { CatalogCard } from "@/lib/catalog";
import { fetchShopCatalog } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import HoverText from "./HoverText";
import CatalogEmpty from "./CatalogEmpty";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "all";
  const [wear, setWear] = useState(categoryParam);
  const [products, setProducts] = useState<CatalogCard[]>([]);
  const [filters, setFilters] = useState<{ id: string; label: string }[]>([
    { id: "all", label: "All Products" },
  ]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setWear(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (filters.length <= 1) return;
    if (wear !== "all" && !filters.some((filter) => filter.id === wear)) {
      setWear("all");
    }
  }, [filters, wear]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const categories = (await fetchShopCatalog()).categories;
        if (cancelled) return;
        setFilters([
          { id: "all", label: "All Products" },
          ...categories.map((category) => ({
            id: category.slug,
            label: category.name,
          })),
        ]);
      } catch {
        if (!cancelled) setFilters([{ id: "all", label: "All Products" }]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCategoryName = useMemo(() => {
    if (wear === "all") return undefined;
    return filters.find((filter) => filter.id === wear && filter.id !== "all")?.label;
  }, [filters, wear]);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      if (wear !== "all" && !selectedCategoryName) return;
      setLoading(true);
      setFailed(false);
      try {
        const catalog = await fetchShopCatalog(selectedCategoryName);
        if (!cancelled) setProducts(catalog.products);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setFailed(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [selectedCategoryName, wear]);

  function onSelect(id: string) {
    setWear(id);
    const href = id === "all" ? "/shop" : `/shop?category=${encodeURIComponent(id)}`;
    router.replace(href, { scroll: false });
  }

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
          {filters.map((filter) => {
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
                onClick={() => onSelect(filter.id)}
              >
                <HoverText>{filter.label}</HoverText>
              </button>
            );
          })}
        </div>

        <div className="shop-grid" data-filter={wear} data-count={products.length}>
          {loading ? (
            <CatalogEmpty
              title="Loading products"
              body="Please wait while we fetch the latest pieces from the catalog."
              href=""
              cta=""
            />
          ) : failed ? (
            <CatalogEmpty
              title="Unable to load products"
              body="Please try again in a moment. The shop will update as soon as the catalog is available."
            />
          ) : products.length ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : wear !== "all" ? (
            <CatalogEmpty
              title="Nothing in this category"
              body="No active products are assigned to this category yet. Try another category or check back soon."
              href="/shop"
              cta="View all products"
            />
          ) : (
            <CatalogEmpty
              title="No products yet"
              body="Products published as active in the admin panel will appear here."
              href="/"
              cta="Back to home"
            />
          )}
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
