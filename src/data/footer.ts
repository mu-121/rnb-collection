export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Shop", href: "/shop" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Styles", href: "/#reviews" },
] as const;

export const footerSocialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Twitter", href: "https://x.com" },
  { label: "Youtube", href: "https://youtube.com" },
] as const;

export const footerContactLinks = [
  {
    label: "test@gmail.com",
    href: "mailto:test@gmail.com",
    icon: "email" as const,
  },
  {
    label: "+001 234 567 890",
    href: "tel:+001 234 567 890",
    icon: "phone" as const,
  },
  {
    label: "London, England",
    href: "https://www.google.com/maps/place/London,+England/@37.1603752,-124.5996215,1139079m/data=!3m2!1e3!4b1!4m6!3m5!1s0x808fb9fe5f285e3d:0x8b5109a227086f55!8m2!3d36.778261!4d-119.4179324!16zL20vMDFuN3E?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D",
    icon: "location" as const,
  },
] as const;

export const footerBrandDescription =
  "A sophisticated e-commerce template designed for modern and minimalist brands.";
