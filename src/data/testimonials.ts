export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  reviewCountLabel: string;
  avatar: string;
  avatarAlt: string;
  /** Brand mark above the quote */
  topLogo: string;
  /** Logo shown in the tab grid when inactive (dark) */
  logoInactive: string;
  /** Logo shown in the tab grid when active (light, on black) */
  logoActive: string;
};

/**
 * Live Wearix Reviews carousel (5 logo tabs).
 * Local MD5 matches used where available; Framer CDN for unmatched light logos / avatars.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    quote:
      "The premium quality of the men's collection is truly unmatched lately. The fabrics feel incredibly premium and soft. This specific tailored fit is perfect for my busy office. A very sharp look. I love it every day.",
    author: "James Carter",
    role: "Creative Director",
    rating: 4.9,
    reviewCountLabel: "4.9/5 from 1k+ reviews",
    avatar: "/Images/wearix-122.png",
    avatarAlt: "Man having tatto on neck",
    topLogo: "/Images/wearix-121.svg",
    logoInactive: "/Images/wearix-121.svg",
    logoActive: "/Images/wearix-123.svg",
  },
  {
    id: "t-02",
    quote:
      "I am obsessed with the elegant modern daily wear. The tailoring is exceptionally modern and sharp. Every piece feels curated for my professional life. Beautiful and versatile style. Truly great quality.",
    author: "Sarah Jenkins",
    role: "Fashion Blogger",
    rating: 4.8,
    reviewCountLabel: "4.8/5 from 5k+ reviews",
    avatar:
      "https://framerusercontent.com/images/4NIBV7zYu8TxX4xxDUa6qNrS2BA.png",
    avatarAlt: "Women in light blue dress",
    topLogo: "/Images/wearix-124.svg",
    logoInactive: "/Images/wearix-124.svg",
    logoActive:
      "https://framerusercontent.com/images/6OHxvoR4r8SmQpzSzCYBMgyjsA.svg",
  },
  {
    id: "t-03",
    quote:
      "Finding clothes that last through many washes is hard. These pieces are exceptionally durable and strong. They hold their deep color and original shape. A great weekend choice. Very reliable brand.",
    author: "David Miller",
    role: "Software Engineer",
    rating: 4.9,
    reviewCountLabel: "4.9/5 from 10k+ reviews",
    avatar:
      "https://framerusercontent.com/images/PWzcSeleQhnziB9U1Jt0avBRqU.png",
    avatarAlt: "Man smiling",
    topLogo:
      "https://framerusercontent.com/images/7kbACU4sJCSU4yfPRkrfwjHNouk.svg",
    logoInactive: "/Images/wearix-125.svg",
    logoActive:
      "https://framerusercontent.com/images/JiQLeLRPpqciykUr6fL1al9KW0.svg",
  },
  {
    id: "t-04",
    quote:
      "The children's line is a lifesaver for growing kids. The styles are fresh and very cool. It handles every playground adventure with total ease. Soft and gentle fabric. Best for kids.",
    author: "Elena Rodriguez",
    role: "Designer",
    rating: 4.8,
    reviewCountLabel: "4.8/5 from 8k+ reviews",
    avatar:
      "https://framerusercontent.com/images/PGuC5To9o9xemPgQKUbMhqQQrQs.png",
    avatarAlt: "Girl in the pinkish lights",
    topLogo: "/Images/wearix-126.svg",
    logoInactive: "/Images/wearix-126.svg",
    logoActive:
      "https://framerusercontent.com/images/fEYIHgS7MWficJzXwuUJ5yBAI58.svg",
  },
  {
    id: "t-05",
    quote:
      "I appreciate the structured design of the new coats. The silhouette is professional and very clean. It provides a sophisticated look for my meetings. A true staple piece. Highly recommend this.",
    author: "Michael Ross",
    role: "Architecture Lead",
    rating: 4.9,
    reviewCountLabel: "4.9/5 from 25k+ reviews",
    avatar:
      "https://framerusercontent.com/images/lLhGu8DamwcMTpVyrwLb7fyLTU8.png",
    avatarAlt: "Man in brownish clothes",
    topLogo: "/Images/wearix-127.svg",
    logoInactive: "/Images/wearix-127.svg",
    logoActive:
      "https://framerusercontent.com/images/wRlrimJ4E2TwwPjr7c6qTp19d3c.svg",
  },
];
