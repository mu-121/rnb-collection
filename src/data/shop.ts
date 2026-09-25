export type ShopWear = "all" | string;

export const shopHero = {
  eyebrowPill: "Shop",
  eyebrowLabel: "The new season",
  heading: "Elevate your daily wardrobe with ease",
  body: "Explore our handpicked modern silhouettes crafted from the world's most sustainable fabrics.",
  image: "https://framerusercontent.com/images/HdE6FLCHJd2VT91mYyisz2G77g8.png?width=934&height=1024",
  imageAlt:
    "Young man in black leather double-breasted jacket jeans looking at the bottom",
  primaryCta: { label: "Explore stories", href: "/blog" },
  secondaryCta: { label: "About us", href: "/about" },
} as const;
