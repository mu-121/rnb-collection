import { shopProducts, type ShopProduct } from "@/data/shop";
import type { ProductBadge } from "@/data/products";

export type ProductDetail = {
  slug: string;
  name: string;
  wearLabel: string;
  badge: ProductBadge;
  price: number;
  compareAtPrice: number;
  description: string;
  material: string;
  care: string;
  warranty: string;
  /** LIVE Order Now destination (Framer link). */
  orderHref: string;
  gallery: string[];
};

export const productTrustFeatures = [
  {
    "id": "quality",
    "title": "Trusted Quality",
    "body": "Every piece is checked to ensure it meets our standards."
  },
  {
    "id": "tracking",
    "title": "Real Time Tracking",
    "body": "Get live updates from our warehouse to your doorstep."
  },
  {
    "id": "payments",
    "title": "Secure Payments",
    "body": "Shop confidently with our secure, encrypted checkout."
  },
  {
    "id": "returns",
    "title": "Easy Returns",
    "body": "Change your mind? Return any item easily within thirty days."
  }
] as const;

const detailsBySlug: Record<
  string,
  Pick<
    ProductDetail,
    | "wearLabel"
    | "description"
    | "material"
    | "care"
    | "warranty"
    | "orderHref"
    | "gallery"
  >
> = {
  "textured-knitted-shirt": {
    wearLabel: "Men's Wear",
    description: "A premium knit construction offering a refined silhouette and breathable comfort for sophisticated everyday summer styling.",
    material: "Premium organic cotton textured knit",
    care: "Machine wash cold, lay flat",
    warranty: "One year full quality guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/dfydRQ0hineaQjqYigxtJ3UUI.jpg",
      "https://framerusercontent.com/images/lvt1WlyrgirePb8z3BSlF9OY.jpg",
      "https://framerusercontent.com/images/wLQPzEAkPBNqeU5YJ0f7pjX7uQ.jpg",
      "https://framerusercontent.com/images/KVUZzQptg8V1Zlr4aAOfp4UqnCs.jpg",
      "https://framerusercontent.com/images/M4ZMtmdhO53WUmCxjjzyjcGZUQ.png",
    ],
  },
  "structured-trench-coat": {
    wearLabel: "Women's Wear",
    description: "Timeless double-breasted design with a removable belt and water-repellent protection.",
    material: "Twill weave cotton with coating",
    care: "Wipe stains with damp cloth",
    warranty: "Two year outerwear protection warranty",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/5KzsTe2EnPlNeHEEFMr7iGl8Q.jpg",
      "https://framerusercontent.com/images/eY6Dmvy1WrbgKmBxjcRhwuXCs.jpg",
      "https://framerusercontent.com/images/KrCSfaETf8NLpkShtQ8QlZDhpM.jpg",
      "https://framerusercontent.com/images/SUxirfaLwILtAwtLjJMR2MrT28.jpg",
      "https://framerusercontent.com/images/azpLRE0bkg0qMC8C1zMVzJbsCdY.jpg",
    ],
  },
  "heavyweight-oversized-hoodie": {
    wearLabel: "Women's Wear",
    description: "Engineered with ultra-soft fleece and a dropped shoulder for the ultimate modern aesthetic and warmth.",
    material: "Heavy gauge brushed fleece cotton",
    care: "Wash inside out, cold water",
    warranty: "Lifetime seam and stitch warranty",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/XHQtokxpBrRieMyXVFgUTB7KS0.jpg",
      "https://framerusercontent.com/images/GTy2Bbh36uTYPS8F34SC1dV1cI.jpg",
      "https://framerusercontent.com/images/wbShIU6uUlTxH6fofGMub3EhfM.jpg",
      "https://framerusercontent.com/images/vp4OWnuCt3fMTPtveeqNugR0kQ.jpg",
      "https://framerusercontent.com/images/H0B3qwIaBkOYTZCwmiLoi4kLFnA.jpg",
    ],
  },
  "mini-denim-overalls": {
    wearLabel: "Children's Wear",
    description: "Durable washed denim with adjustable straps designed to withstand active playtime and frequent laundry cycles.",
    material: "Durable soft wash indigo denim",
    care: "Machine wash with dark colors",
    warranty: "Playground proof fabric quality warranty",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/cUK0QrnnYh9fZ9CgITBVrpOVqbc.jpg",
      "https://framerusercontent.com/images/XKBImpA6SUFBTNUtQrmzAkMmj0.jpg",
      "https://framerusercontent.com/images/KHIv5lmWVaJ79p3nZHtyv89AcKA.jpg",
      "https://framerusercontent.com/images/gIlSOqvlYxCQ8QLh1ZppmFzQ.jpg",
      "https://framerusercontent.com/images/HfZS4WWWX5BzMeBtDj8AVbH0g.jpg",
    ],
  },
  "riviera-collar-shirt": {
    wearLabel: "Children's Wear",
    description: "Lightweight linen blend with a vintage-inspired open collar perfect for warm weather and coastal vacations.",
    material: "Italian linen and silk blend",
    care: "Dry clean for best results",
    warranty: "Full replacement for fabric defects",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/GfaKKpFbbr7OaFyCvPWaUE9M.jpg",
      "https://framerusercontent.com/images/kanGnrYimBokWcnvmRshQIhToM.jpg",
      "https://framerusercontent.com/images/ujQsOST17JwMTpd3VQdRH5KseAE.jpg",
      "https://framerusercontent.com/images/MBJPl7D7laKqGMySui3lknGRbA.jpg",
      "https://framerusercontent.com/images/epumeV6RQSwEmuZR4MDqdvhVNI.jpg",
    ],
  },
  "patterned-knit-sweater": {
    wearLabel: "Children's Wear",
    description: "Fun geometric patterns on a soft cotton-knit base, perfect for school days and family gatherings alike.",
    material: "Soft touch cotton jacquard knit",
    care: "Wash cold, reshape while wet",
    warranty: "Non-itchy comfort and color guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/5n60PDud9wC2hKZ67RqkdLdEnOM.png",
      "https://framerusercontent.com/images/Dh3OA7nlrSTKU7GkFh7IpzC704M.png",
      "https://framerusercontent.com/images/ku166m834pqT7R9c4XWtduk4.jpg",
      "https://framerusercontent.com/images/BBU2YP5maIppwJU2w57F6kaMLY.jpg",
      "https://framerusercontent.com/images/ypQfO8Beqdb4NyQuy972vN8Foo.webp",
    ],
  },
  "stretch-jersey-tee": {
    wearLabel: "Children's Wear",
    description: "Super-stretch fabric and flat seams to prevent irritation, ensuring maximum comfort for growing active children.",
    material: "Flexible cotton and spandex jersey",
    care: "Daily wash, tumble dry high",
    warranty: "Stretch recovery and seam guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/srFy8sCNq5IkDCNHign0ZVGFg.jpg",
      "https://framerusercontent.com/images/m7vGnEDcM9ENme6wUOVRTjDCo.jpg",
      "https://framerusercontent.com/images/2WoeUzwiKS8hQ12VNcNXB0xYDNw.jpg",
      "https://framerusercontent.com/images/g1igfgvN8ekrWDcYm1qFfWmv7HI.jpg",
      "https://framerusercontent.com/images/xkKNU2p0Z0rm224QI7zC7Voh0wg.jpg",
    ],
  },
  "urban-utility-cargo": {
    wearLabel: "Men's Wear",
    description: "Tactical design meeting modern street style with multiple pockets and durable water-resistant fabric for active men.",
    material: "Water resistant technical nylon fabric",
    care: "Wipe clean with damp cloth",
    warranty: "02 year rugged use guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/WOb9Yp9Wh2uVGLxsCjRDhswPSk.png",
      "https://framerusercontent.com/images/5kuNHZXwFk1bRFFCgtwzxcvg.png",
      "https://framerusercontent.com/images/F2QH0lTeQUXPw7gzdXSkN3fJjk.jpg",
      "https://framerusercontent.com/images/jUKl9AUfpVkm7EduM3aOzdAVZKs.jpg",
      "https://framerusercontent.com/images/uarsPNRDg6YBURu7Dhn26aAJ6E.jpg",
    ],
  },
  "classic-boxy-tee": {
    wearLabel: "Men's Wear",
    description: "High-density organic cotton featuring a structured fit that retains its shape wash after wash consistently.",
    material: "Thick premium weight combed cotton",
    care: "Cool wash with similar colors",
    warranty: "Color fastness and shape guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/7ubgMQu9djFMVIvDIXChqxrUQcQ.jpg",
      "https://framerusercontent.com/images/eZoLuRRyYkwjVZaofIyewyScswc.jpg",
      "https://framerusercontent.com/images/A216I2Qn8KIjeMcIztWpD4sNI3I.jpg",
      "https://framerusercontent.com/images/ltEM94UR8Vg4uY9haHov31nQMl8.jpg",
      "https://framerusercontent.com/images/pfRxQ04grgsG0jXRMfU1zWv4giU.jpg",
    ],
  },
  "quilted-bomber-jacket": {
    wearLabel: "Men's Wear",
    description: "Sleek outerwear featuring diamond quilting and insulated lining for a lightweight yet incredibly warm seasonal layer.",
    material: "Recycled polyester with satin lining",
    care: "Gentle cycle, do not bleach",
    warranty: "Insulation loft and heat warranty",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/wtLmzE2wAi9yJrXcWCnR857MSwQ.jpg",
      "https://framerusercontent.com/images/UBz7Wqq5xr8G3Dd1Gqsc3otaozI.webp",
      "https://framerusercontent.com/images/D1sK2oXQzjvkkfdVwHkwh6Vvlo.jpg",
      "https://framerusercontent.com/images/j5MQF7wLU4igNqSz4KWuxsKfb0.jpg",
      "https://framerusercontent.com/images/9ps9tCoDF8pR1xoeBI3F8Te4.webp",
    ],
  },
  "pleated-smart-trousers": {
    wearLabel: "Men's Wear",
    description: "Expertly tailored with a subtle front pleat to bridge the gap between formal and casual attire.",
    material: "Fine wool and elastane mixture",
    care: "Professional dry clean only recommended",
    warranty: "Tailored fit and finish guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/IEfg9X5HmPz0q0vEgmXVpAGMTT8.png",
      "https://framerusercontent.com/images/dw0YCuifIa91zywXckPrBHJmk.webp",
      "https://framerusercontent.com/images/nN44VGXKogGlBrCjwLSczqSe5w.jpg",
      "https://framerusercontent.com/images/PTCA7eKrCBi8djcBpGsMCUh9nmI.jpg",
      "https://framerusercontent.com/images/WoiNkZQUUGcjkw83ZfAI4isnpKQ.webp",
    ],
  },
  "french-terry-shorts": {
    wearLabel: "Men's Wear",
    description: "Premium lounge shorts designed with a relaxed hem and adjustable drawstring for maximum weekend comfort.",
    material: "Soft loopback french terry cotton",
    care: "Easy machine wash, tumble dry",
    warranty: "Comfort and fit satisfaction guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/nCWS7ZqkJVj2BcbIcUsLXJyqDw.jpg",
      "https://framerusercontent.com/images/7J7eSRwqb6hQlWc1WH1nwv01II.webp",
      "https://framerusercontent.com/images/o43U3e9fMDFqfaUplbyzsTPnoOo.jpg",
      "https://framerusercontent.com/images/E0CKi4sMv6nO9aA8QkdbjGRIzA.jpg",
      "https://framerusercontent.com/images/aB7bfLFJoFiBblFQk1GAqIrVy3Q.jpg",
    ],
  },
  "relaxed-tapered-chinos": {
    wearLabel: "Men's Wear",
    description: "Versatile cotton-twill trousers featuring a clean taper and stretch fabric for all-day comfort and sharp looks.",
    material: "Durable stretch cotton twill blend",
    care: "Tumble dry low, warm iron",
    warranty: "Standard 30 day return policy",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/THn1NjXFwjPh3Ajy1FKR7oTjeg.jpg",
      "https://framerusercontent.com/images/LvEon9zPQUG7aIBRaGJKca677s.jpg",
      "https://framerusercontent.com/images/lqcrJbN2waZ7YNstJ5dNb3zJ8.jpg",
      "https://framerusercontent.com/images/fmjelhJ9ypO1AlDlANsKpOg7tbc.jpg",
      "https://framerusercontent.com/images/08NoBArONGaRPYIGpIX2JAoiiI.jpg",
    ],
  },
  "hooded-puffer-vest": {
    wearLabel: "Children's Wear",
    description: "Lightweight synthetic down insulation for core warmth without restricting movement during active play.",
    material: "Polyester shell with faux down",
    care: "Machine wash cold, air dry",
    warranty: "Zipper and warmth performance guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/XlozFfsresg9IzMgSZFB3KFT1lg.png",
      "https://framerusercontent.com/images/VelxipZlAypDaKEGR9UWVL51G0.png",
      "https://framerusercontent.com/images/oJ5cOYRmxIePY7eyjcElx29orBk.jpg",
      "https://framerusercontent.com/images/1ltzB7Y0xn1rFxywwHqWdZOLbdY.jpg",
      "https://framerusercontent.com/images/Z2f8Ge4ElCZhG7IsXg4JAzMcg0.jpg",
    ],
  },
  "v-neck-satin-cami": {
    wearLabel: "Women's Wear",
    description: "Delicate adjustable straps and a shimmering satin finish make this a versatile piece for elegant layering.",
    material: "Lustrous lightweight polyester satin blend",
    care: "Machine wash on delicate cycle",
    warranty: "Color shine and finish guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/NMhqS5KLNF9CvhAGAMKgjg9vlRI.png",
      "https://framerusercontent.com/images/Dtyqi5aiUjHF5XUXmjf8MMxG3l8.png",
      "https://framerusercontent.com/images/LZVtmu3YktGDIcXzJEP9Vi8A8l8.png",
      "https://framerusercontent.com/images/GNbk1BmuAehw9W9ftbDMS9oYE.jpg",
      "https://framerusercontent.com/images/fD72gNjfT5zhjIQbspQuess0RE.jpg",
    ],
  },
  "vegan-leather-leggings": {
    wearLabel: "Children's Wear",
    description: "Soft-touch synthetic leather with high-stretch recovery to provide a sleek, polished look and all-day comfort.",
    material: "Premium four way stretch polyurethane",
    care: "Hand wash cold, air dry",
    warranty: "Anti-peel and crack surface guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/ycSkGEOzXXNIxBrt6AdcjgVnQgE.jpg",
      "https://framerusercontent.com/images/7zAqtP593wdouaqYoeCcOQ86zM.jpg",
      "https://framerusercontent.com/images/RODfI0Rl8tPTChJ84WpP5IeXsI.jpg",
      "https://framerusercontent.com/images/xPPBX2G7av42RyEOL9X2UoQ1A.jpg",
      "https://framerusercontent.com/images/IsX3bLxQBUiC5iMSp8HodEIUw.jpg",
    ],
  },
  "ribbed-knit-midi": {
    wearLabel: "Women's Wear",
    description: "Figure-hugging ribbed texture in a sophisticated midi length that offers both comfort and feminine style.",
    material: "Elasticated ribbed viscose knit fabric",
    care: "Machine wash cold, dry flat",
    warranty: "Stretch and shape retention guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/k6NfKWjk6lwvBolOwhZnCJefQf8.png",
      "https://framerusercontent.com/images/JEW217EDs5BciD7V70HzZsMMmo.jpg",
      "https://framerusercontent.com/images/PZujwpiSux9NT4b9bScPNYUPHmg.jpg",
      "https://framerusercontent.com/images/MHKRKnIJNy3CeklgtCMpeo.jpg",
      "https://framerusercontent.com/images/TpgNS3pphDdRZqKkURIGgeobEsM.png",
    ],
  },
  "cropped-boxy-blazer": {
    wearLabel: "Women's Wear",
    description: "Sharp tailoring meets a contemporary cropped length, perfect for transitioning from the office to dinner.",
    material: "Structured polyester and rayon blend",
    care: "Dry clean only, hang carefully",
    warranty: "One year stitching quality warranty",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/okk2lkiJuugsHxV1sOdrhb14.jpg",
      "https://framerusercontent.com/images/Yg7heWlymsUl0XNuDnDMxv1ndQ.jpg",
      "https://framerusercontent.com/images/4bg2Oj8FbogT4fTDReyIUFokfg.jpg",
      "https://framerusercontent.com/images/vU31awFMEpb4HiJbJgf6tRgI.webp",
      "https://framerusercontent.com/images/Jz1agNdDGOKZ7o3sSKSAddklaY.jpg",
    ],
  },
  "high-waisted-palazzo": {
    wearLabel: "Women's Wear",
    description: "Wide-leg trousers crafted from breathable crepe fabric to ensure a flattering and elongated leg silhouette.",
    material: "Flowy breathable viscose crepe blend",
    care: "Steam only, do not iron",
    warranty: "Thirty day perfect fit guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/FrA5bSsrmynLt6GrVugUXMlc.png",
      "https://framerusercontent.com/images/wWTguaGHI6EENzduLYEvPq7xVs.png",
      "https://framerusercontent.com/images/UA2c7reLlLj8jmY8MjRQMfK2pE.jpg",
      "https://framerusercontent.com/images/rwx6EK3OLQ5sQmNpGKFyPHGCqE.jpg",
      "https://framerusercontent.com/images/wydIsorgwlf8On30BSXUS6VjxQ.jpg",
    ],
  },
  "silk-slip-dress": {
    wearLabel: "Women's Wear",
    description: "Elegant biased-cut silk providing a fluid drape and luxurious feel for evening events or layering.",
    material: "Pure mulberry silk satin fabric",
    care: "Delicate hand wash, cool iron",
    warranty: "Luxury fabric and drape guarantee",
    orderHref: "https://framer.link/nasir-nawaz",
    gallery: [
      "https://framerusercontent.com/images/PDtETHYXl4xYc9YmOm3BoCWo.png",
      "https://framerusercontent.com/images/iOnE7MkZLh1IZqj9HZpECdgQXE.jpg",
      "https://framerusercontent.com/images/244zvDmIYCqrLAi3Fs32SUjnU0.jpg",
      "https://framerusercontent.com/images/nWMBoUiER7oYr01HtCoFPyIwcnE.jpg",
      "https://framerusercontent.com/images/nqH9ZUwhMMeKQMSJIESQEszCk.jpg",
    ],
  },
};

export function getProductDetail(slug: string): ProductDetail | null {
  const shop = shopProducts.find((p) => p.slug === slug);
  const extra = detailsBySlug[slug];
  if (!shop || !extra) return null;
  return {
    slug: shop.slug,
    name: shop.name,
    badge: shop.badge,
    price: shop.price,
    compareAtPrice: shop.compareAtPrice,
    ...extra,
  };
}

export function getAllProductSlugs(): string[] {
  return shopProducts.map((p) => p.slug);
}

export function getShopProduct(slug: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.slug === slug);
}
