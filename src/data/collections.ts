export type Collection = {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  badge: string;
  images: string[];
};

export const collections: Collection[] = [
  {
    id: "col-mens",
    slug: "mens-wear",
    name: "Men's wear",
    title: "Premium modern collection for men",
    description:
      "Upgrade your daily look with our crafted pieces made from the finest fabrics for lasting comfort and timeless style.",
    priceFrom: 45,
    priceTo: 180,
    badge: "New",
    images: [
      "/Images/wearix-099.png",
      "/Images/wearix-100.jpg",
      "/Images/wearix-102.png",
      "/Images/wearix-103.png",
      "/Images/wearix-104.png",
    ],
  },
  {
    id: "col-womens",
    slug: "womens-wear",
    name: "Women's wear",
    title: "Modern daily wear for women",
    description:
      "Elevate your style with our signature soft pieces designed to make every single day feel truly fresh and special.",
    priceFrom: 35,
    priceTo: 150,
    badge: "New",
    images: [
      "/Images/wearix-107.png",
      // Live Image 04 — local wearix-108.png MD5 does not match Framer asset
      "https://framerusercontent.com/images/liIxg0opfCsW1pRixs56aS3Aj4.jpeg",
      "/Images/wearix-111.png",
      "/Images/wearix-112.png",
      "/Images/wearix-113.png",
    ],
  },
  {
    id: "col-children",
    slug: "childrens-wear",
    name: "Children's wear",
    title: "Modern easy styles for children",
    description:
      "Provide your children with the best soft touch gear made for play & long lasting wear throughout every single busy day.",
    priceFrom: 25,
    priceTo: 90,
    badge: "2026",
    images: [
      "/Images/wearix-114.png",
      "/Images/wearix-115.png",
      "/Images/wearix-116.png",
      // Live Image 02 — local wearix-117.jpg MD5 does not match Framer asset
      "https://framerusercontent.com/images/E6tqcNcNIbkMCzBYvnABQBtwcM.jpeg",
      "/Images/wearix-120.png",
    ],
  },
];
