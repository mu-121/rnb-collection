/**
 * Asset map for Wearix homepage recreation.
 * Paths use capital /Images (matches public/Images).
 * Physical files must not be renamed or moved.
 * Mapping confidence: MD5 match against live Framer CDN assets (2026-09-07).
 */

export const IMAGE_BASE_PATH = "/Images" as const;

export const assets = {
  logo: "/Images/wearix-001.svg",

  hero: "/Images/wearix-006.png",
  heroCarousel: [
    "/Images/wearix-006.png",
    "/Images/wearix-009.png",
    "/Images/wearix-011.png",
    "/Images/wearix-002.jpg",
    "/Images/wearix-014.png",
    "/Images/wearix-016.png",
    "/Images/wearix-018.jpg",
  ],

  category: [
    "/Images/wearix-006.png",
    "/Images/wearix-009.png",
    "/Images/wearix-011.png",
    "/Images/wearix-002.jpg",
    "/Images/wearix-014.png",
    "/Images/wearix-016.png",
    "/Images/wearix-018.jpg",
  ],

  newArrivals: [
    "/Images/wearix-020.jpg",
    "/Images/wearix-023.jpg",
    "/Images/wearix-028.jpg",
    "/Images/wearix-031.jpg",
    "/Images/wearix-034.jpg",
    "/Images/wearix-037.jpg",
    "/Images/wearix-040.jpg",
    "/Images/wearix-043.jpg",
    "/Images/wearix-046.jpg",
    "/Images/wearix-049.jpg",
    "/Images/wearix-051.png",
    "/Images/wearix-054.png",
    "/Images/wearix-057.jpg",
    "/Images/wearix-060.jpg",
    "/Images/wearix-062.webp",
    "/Images/wearix-064.png",
    "/Images/wearix-066.webp",
    "/Images/wearix-067.jpg",
  ],

  bestSellers: [
    "/Images/wearix-069.jpg",
    "/Images/wearix-073.jpg",
    "/Images/wearix-075.png",
    "/Images/wearix-077.png",
    "/Images/wearix-079.webp",
    "/Images/wearix-081.jpg",
    "/Images/wearix-083.png",
    "/Images/wearix-085.png",
    "/Images/wearix-088.jpg",
    "/Images/wearix-091.jpg",
    "/Images/wearix-093.jpg",
    "/Images/wearix-096.jpg",
  ],

  collections: {
    mens: [
      "/Images/wearix-099.png",
      "/Images/wearix-100.jpg",
      "/Images/wearix-102.png",
      "/Images/wearix-103.png",
      "/Images/wearix-104.png",
    ],
    womens: [
      "/Images/wearix-107.png",
      "https://framerusercontent.com/images/liIxg0opfCsW1pRixs56aS3Aj4.jpeg",
      "/Images/wearix-111.png",
      "/Images/wearix-112.png",
      "/Images/wearix-113.png",
    ],
    children: [
      "/Images/wearix-114.png",
      "/Images/wearix-115.png",
      "/Images/wearix-116.png",
      "https://framerusercontent.com/images/E6tqcNcNIbkMCzBYvnABQBtwcM.jpeg",
      "/Images/wearix-120.png",
    ],
  },

  testimonials: {
    avatar: "/Images/wearix-122.png",
    logos: [
      "/Images/wearix-121.svg",
      "/Images/wearix-123.svg",
      "/Images/wearix-124.svg",
      "/Images/wearix-125.svg",
      "/Images/wearix-126.svg",
      "/Images/wearix-127.svg",
    ],
  },

  features: [
    "/Images/wearix-129.jpg",
    "/Images/wearix-132.jpg",
    "/Images/wearix-135.png",
    "/Images/wearix-136.jpg",
    "/Images/wearix-138.jpg",
    "/Images/wearix-141.jpg",
    "/Images/wearix-143.png",
    "/Images/wearix-144.png",
    "/Images/wearix-146.jpg",
    "/Images/wearix-148.png",
    "/Images/wearix-150.jpg",
    "/Images/wearix-153.jpg",
  ],

  blog: [
    "/Images/wearix-155.jpg",
    "/Images/wearix-157.png",
    "/Images/wearix-158.png",
  ],

  social: [
    "/Images/wearix-162.png",
    "/Images/wearix-163.jpg",
    "/Images/wearix-166.png",
    "/Images/wearix-167.png",
    "/Images/wearix-168.png",
    "/Images/wearix-169.png",
    "/Images/wearix-171.png",
  ],

  /**
   * Brand Story — live Framer video (exact CDN asset).
   * Poster PNG (UK7WDlVvUzol044n909Euv7v8.png) has no MD5 match in public/Images.
   */
  brandStory: {
    video:
      "https://framerusercontent.com/assets/tZkQWQqHkaDjOS2aRu06UvSAiY.mp4",
    poster:
      "https://framerusercontent.com/images/UK7WDlVvUzol044n909Euv7v8.png",
  },
} as const;

export type Assets = typeof assets;
