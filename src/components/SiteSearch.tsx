"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchActiveProducts, toCardProduct, type CatalogCard } from "@/lib/catalog";

export default function SiteSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const value = query.trim();
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const products = await fetchActiveProducts({ search: value, limit: 12 });
        setResults(products.map((product) => toCardProduct(product)));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [open, query]);

  if (!open) return null;

  return (
    <div className="site-search" role="dialog" aria-label="Search products">
      <button type="button" className="site-search__backdrop" aria-label="Close search" onClick={onClose} />
      <div className="site-search__panel">
        <input
          className="site-search__input"
          type="search"
          value={query}
          autoFocus
          placeholder="Search products"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="site-search__results">
          {loading ? <p className="site-search__status">Searching...</p> : null}
          {!loading && query.trim().length >= 2 && !results.length ? (
            <p className="site-search__status">No matching products.</p>
          ) : null}
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="site-search__item"
              onClick={onClose}
            >
              <span>{product.name}</span>
              <span>${product.price.toFixed(2)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
