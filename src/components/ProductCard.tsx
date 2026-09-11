import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

/** Framer sparkle glyph (symbol #1529132500) — stroked 4-point star + corner rays. */
export function SparkleIcon({
  size = 15,
  strokeWidth = 1.5,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      className="product-card__badge-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g transform="translate(2.25 5.25)">
        <path
          d="M 5.65 10.849 L 0.485 8.946 C 0.194 8.839 0 8.561 0 8.25 C 0 7.939 0.194 7.661 0.485 7.553 L 5.65 5.65 L 7.553 0.485 C 7.661 0.194 7.939 0 8.25 0 C 8.561 0 8.839 0.194 8.946 0.485 L 10.849 5.65 L 16.014 7.553 C 16.306 7.661 16.5 7.939 16.5 8.25 C 16.5 8.561 16.306 8.839 16.014 8.946 L 10.849 10.849 L 8.946 16.014 C 8.839 16.306 8.561 16.5 8.25 16.5 C 7.939 16.5 7.661 16.306 7.553 16.014 Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
      <path d="M16.5 1.5v4.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M21 6.75v3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M14.25 3.75h4.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M19.5 8.25h3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** Framer crown glyph (symbol #850442575) — Best seller badge + Best sellers eyebrow. */
export function CrownIcon({
  size = 15,
  strokeWidth = 2,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      className="product-card__badge-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="1.875"
        cy="1.875"
        r="1.875"
        transform="translate(10.125 3)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="1.875"
        cy="1.875"
        r="1.875"
        transform="translate(18.75 5.625)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="1.875"
        cy="1.875"
        r="1.875"
        transform="translate(1.5 5.625)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 6.695 0 L 3.693 6.905 L 0 2.36"
        transform="translate(4.557 6.595)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 6.695 2.36 L 3.002 6.905 L 0 0"
        transform="translate(12.748 6.595)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 0 0 L 1.462 8.774 C 1.523 9.135 1.836 9.4 2.202 9.4 L 14.431 9.4 C 14.797 9.4 15.11 9.135 15.171 8.774 L 16.633 0"
        transform="translate(3.683 9.35)"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const remotePrimary = product.hoverImage.startsWith("http");
  const remoteHover = product.image.startsWith("http");

  return (
    <Link href={`/shop/${product.slug}`} className="product-card">
      <div className="product-card__media">
        {/* Live Wearix shows products.ts hoverImage as the default, image on hover */}
        <Image
          src={product.hoverImage}
          alt={product.name}
          fill
          sizes="(max-width: 809.98px) 100vw, (max-width: 1199.98px) 50vw, 373px"
          className="product-card__image product-card__image--primary"
          unoptimized={remotePrimary}
        />
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(max-width: 809.98px) 100vw, (max-width: 1199.98px) 50vw, 373px"
          className="product-card__image product-card__image--hover"
          unoptimized={remoteHover}
        />

        {product.badge ? (
          <span
            className={
              product.badge === "Best seller"
                ? "product-card__badge product-card__badge--dark"
                : "product-card__badge"
            }
          >
            {product.badge === "Best seller" ? (
              <CrownIcon size={15} strokeWidth={2} />
            ) : (
              <SparkleIcon size={15} strokeWidth={1.5} />
            )}
            <span className="product-card__badge-text">{product.badge}</span>
          </span>
        ) : null}

        <span className="product-card__arrow" aria-hidden="true">
          <Image
            src="/Images/wearix-025.svg"
            alt=""
            width={16}
            height={16}
            className="product-card__arrow-icon"
          />
        </span>
      </div>

      <div className="product-card__body">
        <div className="product-card__meta">
          <div className="product-card__copy">
            <h3 className="product-card__name">{product.name}</h3>
            <div className="product-card__prices">
              <span className="product-card__price">{formatPrice(product.price)}</span>
              <span className="product-card__compare">
                {formatPrice(product.compareAtPrice)}
              </span>
            </div>
          </div>

          <div className="product-card__swatches" aria-hidden="true">
            <span className="product-card__swatch product-card__swatch--active">
              <span className="product-card__swatch-inner">
                <Image
                  src={product.hoverImage}
                  alt=""
                  width={30}
                  height={30}
                  className="product-card__swatch-image"
                  unoptimized={remotePrimary}
                />
              </span>
            </span>
            <span className="product-card__swatch">
              <span className="product-card__swatch-inner">
                <Image
                  src={product.image}
                  alt=""
                  width={30}
                  height={30}
                  className="product-card__swatch-image"
                  unoptimized={remoteHover}
                />
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
