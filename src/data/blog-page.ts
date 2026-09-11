/**
 * Full /blog page data — separate from homepage `blog.ts` (locked).
 * Article order/copy match LIVE Wearix /blog.
 */

export type BlogPageCategory =
  | "all"
  | "Style Guide"
  | "Fashion Tips"
  | "Brand Stories";

export type BlogPagePost = {
  id: string;
  slug: string;
  title: string;
  category: Exclude<BlogPageCategory, "all">;
  excerpt?: string;
  readTime: string;
  date: string;
  image: string;
  featured?: boolean;
};

export const blogPageHero = {
  eyebrowPill: "Blog",
  eyebrowLabel: "Read our stories",
  heading: "The craft behind every single stitch",
  body: "Discover the detailed process of creating premium garments from our sustainable materials.",
  image:
    "https://framerusercontent.com/images/35jbjH7zEBW0GXGMbgGlejxpwB0.jpeg",
  imageAlt: "Craft and fabric details behind Wearix garments",
  primaryCta: { label: "Browse collections", href: "/shop" },
  secondaryCta: { label: "About us", href: "/about" },
} as const;

export const blogPageFilters: {
  id: BlogPageCategory;
  label: string;
}[] = [
  { id: "all", label: "All Blogs" },
  { id: "Style Guide", label: "Style Guide" },
  { id: "Fashion Tips", label: "Fashion Tips" },
  { id: "Brand Stories", label: "Brand Stories" },
];

/**
 * Local MD5 matches where available; remaining LIVE assets use Framer CDN
 * (no matching file in public/Images).
 */
export const blogPagePosts: BlogPagePost[] = [
  {
    id: "bp-01",
    slug: "how-to-master-the-art-of-minimal-street-style",
    title: "How to master the art of minimal street style",
    category: "Style Guide",
    excerpt:
      "Build a timeless, comfortable wardrobe with high-quality fabrics, muted tones, and effortless oversized fits.",
    readTime: "8 min read",
    date: "Jan 29, 2026",
    image: "/Images/wearix-156.jpg",
    featured: true,
  },
  {
    id: "bp-02",
    slug: "elevate-everyday-outfits-using-modern-minimalist-styling",
    title: "Elevate everyday outfits using modern minimalist styling",
    category: "Fashion Tips",
    readTime: "8 min read",
    date: "12/30/25",
    image: "/Images/wearix-157.png",
  },
  {
    id: "bp-03",
    slug: "build-a-capsule-wardrobe-that-works-year-round",
    title: "Build a capsule wardrobe that works year round",
    category: "Style Guide",
    readTime: "5 min read",
    date: "11/22/25",
    image: "/Images/wearix-159.png",
  },
  {
    id: "bp-04",
    slug: "refine-casual-streetwear-with-thoughtful-styling-choices",
    title: "Refine casual streetwear with thoughtful styling choices",
    category: "Fashion Tips",
    readTime: "8 min read",
    date: "10/12/25",
    image:
      "https://framerusercontent.com/images/Rgl552fnphzXIpke91z265iosU.png",
  },
  {
    id: "bp-05",
    slug: "style-outfits-confidently-using-seasonal-color-palettes",
    title: "Style outfits confidently using seasonal color palettes",
    category: "Style Guide",
    readTime: "9 min read",
    date: "10/24/25",
    image:
      "https://framerusercontent.com/images/YRHt9c7e9X3xKQWj3EtnUpPEdcY.png",
  },
  {
    id: "bp-06",
    slug: "discover-timeless-essentials-that-shape-modern-wardrobes",
    title: "Discover timeless essentials that shape modern wardrobes",
    category: "Style Guide",
    readTime: "8 min read",
    date: "12/21/25",
    image:
      "https://framerusercontent.com/images/bfKnYz5PM2SU3fPvsCyVCnuFsY.png",
  },
  {
    id: "bp-07",
    slug: "build-a-strong-fashion-identity-through-consistency",
    title: "Build a strong fashion identity through consistency",
    category: "Brand Stories",
    readTime: "6 min read",
    date: "10/16/24",
    image:
      "https://framerusercontent.com/images/VjeS4g3bothn3ykWlAjDWS5giK0.png",
  },
  {
    id: "bp-08",
    slug: "design-intentional-outfits-that-feel-effortless-daily",
    title: "Design intentional outfits that feel effortless daily",
    category: "Brand Stories",
    readTime: "7 min read",
    date: "12/24/25",
    image:
      "https://framerusercontent.com/images/gWNl9J30vKv4SW0ITunuKmvtfW0.jpeg",
  },
  {
    id: "bp-09",
    slug: "use-texture-to-elevate-everyday-outfit-styling",
    title: "Use texture to elevate everyday outfit styling",
    category: "Fashion Tips",
    readTime: "5 min read",
    date: "10/24/25",
    image:
      "https://framerusercontent.com/images/ySVxzwG1Y66iKkI0QESKXxQk8Jw.png",
  },
];

export function filterBlogPagePosts(
  category: BlogPageCategory,
  catalog: BlogPagePost[] = blogPagePosts,
): BlogPagePost[] {
  if (category === "all") return catalog;
  return catalog.filter((p) => p.category === category);
}
