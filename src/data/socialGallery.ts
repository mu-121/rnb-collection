export type SocialGalleryArm = {
  id: string;
  angle: number;
  image: string;
  alt: string;
};

/**
 * Live Framer Social Gallery arms (symbol carousel).
 * Angles and asset mapping verified against wearix.framer.website (MD5 match).
 */
export const socialGalleryArms: SocialGalleryArm[] = [
  {
    id: "arm-1",
    angle: 90,
    image: "/Images/wearix-162.png",
    alt: "Community member in modern layered streetwear",
  },
  {
    id: "arm-2",
    angle: 120,
    image: "/Images/wearix-163.jpg",
    alt: "Community member in a black hoodie portrait",
  },
  {
    id: "arm-3",
    angle: 150,
    image: "/Images/wearix-166.png",
    alt: "Child wearing a graphic long-sleeve tee",
  },
  {
    id: "arm-4",
    angle: 180,
    image: "/Images/wearix-167.png",
    alt: "Community member in a grey utility jacket and sunglasses",
  },
  {
    id: "arm-5",
    angle: 0,
    image: "/Images/wearix-168.png",
    alt: "Brown velvet hoodie product flat lay",
  },
  {
    id: "arm-6",
    angle: 30,
    image: "/Images/wearix-169.png",
    alt: "Community member in an olive jacket profile",
  },
  {
    id: "arm-7",
    angle: 60,
    image: "/Images/wearix-171.png",
    alt: "Community member in a light knit sweater",
  },
];
