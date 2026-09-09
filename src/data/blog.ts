export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt?: string;
  readTime: string;
  date: string;
  image: string;
  featured?: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    id: "blog-01",
    slug: "how-to-master-the-art-of-minimal-street-style",
    title: "How to master the art of minimal street style",
    category: "Style Guide",
    excerpt:
      "Build a timeless, comfortable wardrobe with high-quality fabrics, muted tones, and effortless oversized fits.",
    readTime: "8 min read",
    date: "Jan 29, 2026",
    image: "/Images/wearix-155.jpg",
    featured: true,
  },
  {
    id: "blog-02",
    slug: "elevate-everyday-outfits-using-modern-minimalist-styling",
    title: "Elevate everyday outfits using modern minimalist styling",
    category: "Fashion Tips",
    readTime: "8 min read",
    date: "12/30/25",
    image: "/Images/wearix-157.png",
  },
  {
    id: "blog-03",
    slug: "build-a-capsule-wardrobe-that-works-year-round",
    title: "Build a capsule wardrobe that works year round",
    category: "Style Guide",
    readTime: "5 min read",
    date: "11/22/25",
    image: "/Images/wearix-158.png",
  },
];
