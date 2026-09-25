export type ProductBadge = "New" | "Best seller" | (string & {});

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number;
  badge: ProductBadge | "";
  category: "new-arrivals" | "best-sellers" | string;
  image: string;
  hoverImage: string;
};
