/**
 * About page content + assets from live Wearix /about.
 * Local MD5 matches used where available; Framer CDN otherwise.
 * public/Images is not modified.
 */

const FRAMER = "https://framerusercontent.com/images";

export const aboutHero = {
  eyebrowPill: "About",
  eyebrowLabel: "Know about Wearix",
  heading: "Timeless design, modern wearability",
  body: "We focus on creating essential garments that remain relevant, functional, and refined across seasons.",
  image: `${FRAMER}/wX2ONi3VmPlzsnApW0bSgrCBFE8.png?width=1024&height=1024`,
  imageAlt: "Three people in trench coats walk past a neon storefront.",
  primaryCta: { label: "Browse collections", href: "/shop" },
  secondaryCta: { label: "About us", href: "/about" },
} as const;

export const aboutTrust = {
  rating: "4.9/5",
  ratingLabel: "rating",
  trusted: "Trusted by 1k+ businesses",
  avatars: [
    `${FRAMER}/xjBP37MgaLIT2MdXe0Kl896XmbM.png?width=512&height=512`,
    `${FRAMER}/V6kvRnK4tvwVKtnM3SDW7g4T9I.png?width=512&height=512`,
    `${FRAMER}/8Y1Vd6ysDPyE3ONSfgw125SCPw.png?width=512&height=512`,
    `${FRAMER}/qL5xOqMFC6yF35qSRHaAWJGZQKU.png?width=512&height=512`,
    `${FRAMER}/G8RDO1PQndTWIrwwR6NkSGjho.png?width=512&height=512`,
  ],
  logos: [
    {
      src: `${FRAMER}/4I0nUFgLGKqAqwEE0S5l6yrCXzQ.svg?width=132&height=35`,
      width: 111,
      height: 30,
    },
    {
      src: `${FRAMER}/K7N7aNahky7BhBGyGdXp7oSDc.svg?width=100&height=51`,
      width: 65,
      height: 30,
    },
    {
      src: `${FRAMER}/UsU6TSwGi1GYzawTJkBdu5BNeqg.svg?width=105&height=40`,
      width: 65,
      height: 30,
    },
    {
      src: `${FRAMER}/Qifbcz2UjIveHTCuImUZcqT9kZg.svg?width=140&height=30`,
      width: 94,
      height: 26,
    },
    {
      src: `${FRAMER}/6QEz8kJbwqWFzbNDcgcMwaBk7Jk.svg?width=176&height=40`,
      width: 65,
      height: 30,
    },
  ],
} as const;

export const aboutMission = {
  eyebrow: "About RNB",
  heading:
    "More than fashion, Wearix is a commitment to intentional design. Our curated collections focus on sleek silhouettes, empowering your unique and personal journey with modern ease.",
  stats: [
    {
      id: "pieces",
      value: "10M+",
      label: "Pieces worn daily",
      image: `${FRAMER}/pEBq80I4IeHuPWY6F4zlaCYPo.png?scale-down-to=512&width=1200&height=1200`,
      imageAlt: "Blue T-shirt",
      icon: "/Images/i11.svg",
    },
    {
      id: "satisfaction",
      value: "98%",
      label: "Customer Satisfaction",
      image: `${FRAMER}/gXeXEdJCGwcyaYKiWNSbF2Wf5Yg.jpeg?scale-down-to=1024&width=810&height=1440`,
      imageAlt: "Woman in stylish dress",
      icon: "/Images/i22.svg",
    },
    {
      id: "styles",
      value: "300+",
      label: "Essential Styles",
      image: `${FRAMER}/nvGX8w2EmNhLJbIVjLMsGKTV4I.jpeg?scale-down-to=512&width=1280&height=1280`,
      imageAlt: "Woman in black dress",
      icon: "/Images/i33.svg",
    },
    {
      id: "community",
      value: "500K+",
      label: "Community worldwide",
      image: `${FRAMER}/k4gwIeU3rPPXIyxSMgWszrewfy8.png?scale-down-to=512&width=1200&height=904`,
      imageAlt: "Community of boys",
      icon: "/Images/i44.svg",
    },
  ],
} as const;
