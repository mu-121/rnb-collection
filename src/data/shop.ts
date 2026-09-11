import {
  bestSellers,
  newArrivals,
  type Product,
  type ProductBadge,
} from "@/data/products";

export type ShopWear = "all" | "men" | "women" | "children";

export type ShopProduct = Product & {
  wear: Exclude<ShopWear, "all">;
};

const FRAMER = "https://framerusercontent.com/images";

/** LIVE Shop hero — no MD5 match in public/Images. */
export const shopHero = {
  eyebrowPill: "Shop",
  eyebrowLabel: "The new season",
  heading: "Elevate your daily wardrobe with ease",
  body: "Explore our handpicked modern silhouettes crafted from the world's most sustainable fabrics.",
  image: `${FRAMER}/HdE6FLCHJd2VT91mYyisz2G77g8.png?width=934&height=1024`,
  imageAlt:
    "Young man in black leather double-breasted jacket jeans looking at the bottom",
  primaryCta: { label: "Explore stories", href: "/blog" },
  secondaryCta: { label: "About us", href: "/about" },
} as const;

export const shopFilters: { id: ShopWear; label: string }[] = [
  { id: "all", label: "All Products" },
  { id: "men", label: "Men's Wear" },
  { id: "women", label: "Women's Wear" },
  { id: "children", label: "Children's Wear" },
];

function withWear(
  product: Product,
  wear: Exclude<ShopWear, "all">,
): ShopProduct {
  return { ...product, wear };
}

/** Extra LIVE Shop products — Framer CDN (no local MD5 match). */
const shopOnlyProducts: ShopProduct[] = [
  {
    id: "shop-01",
    slug: "relaxed-tapered-chinos",
    name: "Relaxed Tapered Chinos",
    price: 65,
    compareAtPrice: 80,
    badge: "New",
    category: "new-arrivals",
    wear: "men",
    image: `${FRAMER}/LvEon9zPQUG7aIBRaGJKca677s.jpg`,
    hoverImage: `${FRAMER}/THn1NjXFwjPh3Ajy1FKR7oTjeg.jpg`,
  },
  {
    id: "shop-02",
    slug: "v-neck-satin-cami",
    name: "V-Neck Satin Cami",
    price: 65,
    compareAtPrice: 90,
    badge: "New",
    category: "new-arrivals",
    wear: "women",
    image: `${FRAMER}/Dtyqi5aiUjHF5XUXmjf8MMxG3l8.png`,
    hoverImage: `${FRAMER}/NMhqS5KLNF9CvhAGAMKgjg9vlRI.png`,
  },
  {
    id: "shop-03",
    slug: "ribbed-knit-midi",
    name: "Ribbed Knit Midi",
    price: 95,
    compareAtPrice: 125,
    badge: "New",
    category: "new-arrivals",
    wear: "women",
    image: `${FRAMER}/JEW217EDs5BciD7V70HzZsMMmo.jpg`,
    hoverImage: `${FRAMER}/k6NfKWjk6lwvBolOwhZnCJefQf8.png`,
  },
  {
    id: "shop-04",
    slug: "high-waisted-palazzo",
    name: "High Waisted Palazzo",
    price: 85,
    compareAtPrice: 110,
    badge: "New",
    category: "new-arrivals",
    wear: "women",
    image: `${FRAMER}/wWTguaGHI6EENzduLYEvPq7xVs.png`,
    hoverImage: `${FRAMER}/FrA5bSsrmynLt6GrVugUXMlc.png`,
  },
  {
    id: "shop-05",
    slug: "silk-slip-dress",
    name: "Silk Slip Dress",
    price: 120,
    compareAtPrice: 160,
    badge: "New",
    category: "new-arrivals",
    wear: "women",
    image: `${FRAMER}/iOnE7MkZLh1IZqj9HZpECdgQXE.jpg`,
    hoverImage: `${FRAMER}/PDtETHYXl4xYc9YmOm3BoCWo.png`,
  },
];

/**
 * LIVE /shop order (20 items). Existing homepage products keep local MD5 assets.
 * Wear tags drive category tabs (LIVE CMS tabs do not reduce the list).
 */
export const shopProducts: ShopProduct[] = [
  withWear(newArrivals[0], "men"), // Textured Knitted Shirt
  withWear(newArrivals[1], "men"), // Structured Trench Coat
  withWear(bestSellers[0], "men"), // Heavyweight Oversized Hoodie
  withWear(newArrivals[2], "children"), // Mini Denim Overalls
  withWear(newArrivals[3], "men"), // Riviera Collar Shirt
  withWear(bestSellers[1], "women"), // Patterned Knit Sweater
  withWear(newArrivals[4], "men"), // Stretch Jersey Tee
  withWear(newArrivals[5], "men"), // Urban Utility Cargo
  withWear(newArrivals[6], "men"), // Classic Boxy Tee
  withWear(bestSellers[2], "men"), // Quilted Bomber Jacket
  withWear(newArrivals[7], "men"), // Pleated Smart Trousers
  withWear(newArrivals[8], "men"), // French Terry Shorts
  shopOnlyProducts[0], // Relaxed Tapered Chinos
  withWear(bestSellers[3], "men"), // Hooded Puffer Vest
  shopOnlyProducts[1], // V-Neck Satin Cami
  withWear(bestSellers[4], "women"), // Vegan Leather Leggings
  shopOnlyProducts[2], // Ribbed Knit Midi
  withWear(bestSellers[5], "women"), // Cropped Boxy Blazer
  shopOnlyProducts[3], // High Waisted Palazzo
  shopOnlyProducts[4], // Silk Slip Dress
];

export type { ProductBadge };
