"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductDetail } from "@/data/productDetails";
import { productTrustFeatures } from "@/data/productDetails";
import HoverText from "./HoverText";
import ProductGallery from "./ProductGallery";
import { formatPKR } from "@/lib/format";
import { useCart } from "@/context/CartContext";

function TrustIcon({ id }: { id: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" as const, "aria-hidden": true as const };
  if (id === "quality") return <svg {...common}><path d="M12 3l2.2 4.46 4.92.72-3.56 3.47.84 4.9L12 14.9l-4.4 2.65.84-4.9L4.88 8.18l4.92-.72L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  if (id === "tracking") return <svg {...common}><path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" /></svg>;
  if (id === "payments") return <svg {...common}><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" /></svg>;
  return <svg {...common}><path d="M4 7h12l4 4v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 7v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

function DetailIcon({ kind }: { kind: "material" | "care" | "warranty" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" as const, "aria-hidden": true as const };
  if (kind === "material") return <svg {...common}><path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  if (kind === "care") return <svg {...common}><path d="M12 3.5 13.8 9h5.7l-4.6 3.4 1.8 5.6L12 14.8 7.3 18l1.8-5.6L4.5 9h5.7L12 3.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" /><path d="M8.2 12.2 10.7 14.7 15.8 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function ProductDetailPage({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const { addItem } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError("Please select a size.");
      return false;
    }
    for (const v of (product.variations || [])) {
      if (!selectedVariations[v.name]) {
        setError(`Please select a ${v.name}.`);
        return false;
      }
    }
    
    setError("");
    
    const variationStr = Object.keys(selectedVariations).length > 0 
      ? Object.entries(selectedVariations).map(([k, v]) => `${k}: ${v}`).join(", ") 
      : undefined;

    addItem({
      productId: product.slug, // Using slug as ID for frontend mock data
      name: product.name,
      image: product.gallery[0] || "",
      price: product.price,
      quantity: 1,
      size: selectedSize || undefined,
      variation: variationStr,
      stock: product.stock !== undefined ? product.stock : 99,
    });
    
    alert("Added to cart!"); 
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      router.push("/cart");
    }
  };

  return (
    <article className="product-page">
      <div className="product-page__inner">
        <div className="product-page__layout">
          <ProductGallery name={product.name} images={product.gallery} badge={product.badge} />

          <div className="product-info">
            <div className="product-info__meta">
              <Link href="/shop" className="product-info__shop-pill">Shop</Link>
              <span className="product-info__wear">{product.wearLabel}</span>
            </div>

            <h1 className="product-info__title">{product.name}</h1>

            <div className="product-info__pricing">
              <span className="product-info__price">{formatPKR(product.price)}</span>
              {product.compareAtPrice > product.price && (
                <span className="product-info__compare">{formatPKR(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="product-info__description">{product.description}</p>

            {product.stock !== undefined && product.stock <= 0 ? (
              <p className="product-info__description" style={{color: 'red'}}>Currently out of stock.</p>
            ) : null}

            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p className="product-info__wear" style={{marginBottom: '8px'}}>Select Size:</p>
                <div style={{display: 'flex', gap: '8px'}}>
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px', 
                        border: selectedSize === size ? '2px solid #005AFA' : '1px solid #ccc',
                        borderRadius: '4px',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variations?.map((variation) => (
              <div key={variation.name} style={{ marginBottom: '1rem' }}>
                <p className="product-info__wear" style={{marginBottom: '8px'}}>Select {variation.name}:</p>
                <div style={{display: 'flex', gap: '8px'}}>
                  {variation.options.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setSelectedVariations(prev => ({...prev, [variation.name]: opt}))}
                      style={{
                        padding: '8px 16px', 
                        border: selectedVariations[variation.name] === opt ? '2px solid #005AFA' : '1px solid #ccc',
                        borderRadius: '4px',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}

            <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
              <button onClick={handleAddToCart} className="product-info__order" style={{flex: 1, background: '#fff', color: '#005AFA', border: '1px solid #005AFA', cursor: 'pointer', padding: '16px', borderRadius: '4px', fontWeight: 'bold'}}>
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="product-info__order" style={{flex: 1, cursor: 'pointer', border: 'none', padding: '16px', borderRadius: '4px', fontWeight: 'bold'}}>
                Buy Now
              </button>
            </div>

            <dl className="product-details">
              <div className="product-details__row">
                <dt><span className="product-details__icon" aria-hidden="true"><DetailIcon kind="material" /></span>Material</dt>
                <dd>{product.material}</dd>
              </div>
              <div className="product-details__row">
                <dt><span className="product-details__icon" aria-hidden="true"><DetailIcon kind="care" /></span>Care</dt>
                <dd>{product.care}</dd>
              </div>
              <div className="product-details__row">
                <dt><span className="product-details__icon" aria-hidden="true"><DetailIcon kind="warranty" /></span>Warranty</dt>
                <dd>{product.warranty}</dd>
              </div>
            </dl>
          </div>
        </div>

        <ul className="product-trust">
          {productTrustFeatures.map((feature) => (
            <li key={feature.id} className="product-trust__card">
              <span className="product-trust__icon" aria-hidden="true"><TrustIcon id={feature.id} /></span>
              <div className="product-trust__copy">
                <h2 className="product-trust__title">{feature.title}</h2>
                <p className="product-trust__body">{feature.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
