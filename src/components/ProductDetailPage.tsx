import Link from "next/link";
import type { ProductDetail } from "@/data/productDetails";
import { productTrustFeatures } from "@/data/productDetails";
import { CrownIcon, SparkleIcon } from "./ProductCard";
import HoverText from "./HoverText";
import ProductGallery from "./ProductGallery";

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function TrustIcon({ id }: { id: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  if (id === "quality") {
    return (
      <svg {...common}>
        <path
          d="M12 3l2.2 4.46 4.92.72-3.56 3.47.84 4.9L12 14.9l-4.4 2.65.84-4.9L4.88 8.18l4.92-.72L12 3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "tracking") {
    return (
      <svg {...common}>
        <path
          d="M3 12a9 9 0 1 0 9-9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "payments") {
    return (
      <svg {...common}>
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M4 7h12l4 4v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 7v4h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductDetailPage({
  product,
}: {
  product: ProductDetail;
}) {
  const isBest = product.badge === "Best seller";

  return (
    <article className="product-page">
      <div className="product-page__inner">
        <div className="product-page__layout">
          <ProductGallery name={product.name} images={product.gallery} />

          <div className="product-info">
            <div className="product-info__meta">
              <span
                className={`product-info__badge${
                  isBest ? " product-info__badge--best" : ""
                }`}
              >
                {isBest ? (
                  <CrownIcon size={14} strokeWidth={1.8} />
                ) : (
                  <SparkleIcon size={14} strokeWidth={1.5} />
                )}
                <span>{product.badge}</span>
              </span>

              <nav className="product-info__crumbs" aria-label="Breadcrumb">
                <Link href="/shop" className="product-info__crumb">
                  Shop
                </Link>
                <span className="product-info__crumb-sep" aria-hidden="true">
                  /
                </span>
                <span className="product-info__crumb is-current">
                  {product.wearLabel}
                </span>
              </nav>
            </div>

            <h1 className="product-info__title">{product.name}</h1>

            <div className="product-info__pricing">
              <span className="product-info__price">
                {formatPrice(product.price)}
              </span>
              <span className="product-info__compare">
                {formatPrice(product.compareAtPrice)}
              </span>
            </div>

            <p className="product-info__description">{product.description}</p>

            <a
              href={product.orderHref}
              className="product-info__order"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HoverText>Order Now</HoverText>
            </a>

            <dl className="product-details">
              <div className="product-details__row">
                <dt>Material</dt>
                <dd>{product.material}</dd>
              </div>
              <div className="product-details__row">
                <dt>Care</dt>
                <dd>{product.care}</dd>
              </div>
              <div className="product-details__row">
                <dt>Warranty</dt>
                <dd>{product.warranty}</dd>
              </div>
            </dl>
          </div>
        </div>

        <ul className="product-trust">
          {productTrustFeatures.map((feature) => (
            <li key={feature.id} className="product-trust__card">
              <span className="product-trust__icon" aria-hidden="true">
                <TrustIcon id={feature.id} />
              </span>
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
