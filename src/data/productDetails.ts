import type { ProductBadge } from "@/data/products";

export type ProductColorVariant = {
  id: string;
  colorName: string;
  colorCode: string;
  images: string[];
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  wearLabel: string;
  badge: ProductBadge | "";
  price: number;
  compareAtPrice: number;
  description: string;
  material: string;
  care: string;
  warranty: string;
  orderHref: string;
  gallery: string[];
  variations?: { name: string; options: string[] }[];
  sizes?: string[];
  colorVariants?: ProductColorVariant[];
  stock?: number;
};

export const productTrustFeatures = [
  {
    id: "quality",
    title: "Trusted Quality",
    body: "Every piece is checked to ensure it meets our standards.",
  },
  {
    id: "tracking",
    title: "Real Time Tracking",
    body: "Get live updates from our warehouse to your doorstep.",
  },
  {
    id: "payments",
    title: "Secure Payments",
    body: "Shop confidently with our secure, encrypted checkout.",
  },
  {
    id: "returns",
    title: "Easy Returns",
    body: "Change your mind? Return any item easily within thirty days.",
  },
] as const;
