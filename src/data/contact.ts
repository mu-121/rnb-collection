/**
 * Contact page data — LIVE Wearix /contact structure + copy.
 * Hero + side image: no local MD5 match → Framer CDN.
 */

export const contactHero = {
  eyebrowPill: "Contact",
  eyebrowLabel: "Here to help you",
  heading: "Helping you define your personal style",
  body: "Contact us today for refined service designed for our discerning Wearix fashion community.",
  image:
    "https://framerusercontent.com/images/qQSMjW83F8jPIOKDIIevJNTWs.png",
  imageAlt: "Portrait lighting for Wearix contact",
  primaryCta: { label: "Browse collections", href: "/shop" },
  secondaryCta: { label: "About us", href: "/about" },
} as const;

export const contactMedia = {
  image:
    "https://framerusercontent.com/images/K378y5QYg0ECY163RuzyDfByVOU.png",
  imageAlt: "Wearix model in modern streetwear",
} as const;

export type ContactInfoItem = {
  id: string;
  value: string;
  label: string;
  href: string;
  icon: "email" | "phone" | "location";
};

export const contactInfo: ContactInfoItem[] = [
  {
    id: "email",
    value: "test@gmail.com",
    label: "Email Address",
    href: "mailto:test@gmail.com",
    icon: "email",
  },
  {
    id: "phone",
    value: "+001 234 567 890",
    label: "Phone Number",
    href: "tel:+001 234 567 890",
    icon: "phone",
  },
  {
    id: "location",
    value: "England, London",
    label: "Location",
    href: "https://www.google.com/maps/place/London,+England/@37.1603752,-124.5996215,1139079m/data=!3m2!1e3!4b1!4m6!3m5!1s0x808fb9fe5f285e3d:0x8b5109a227086f55!8m2!3d36.778261!4d-119.4179324!16zL20vMDFuN3E?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D",
    icon: "location",
  },
];

export const contactFormFields = {
  firstName: {
    id: "contact-first-name",
    name: "firstName",
    label: "First Name",
    placeholder: "Nasir",
    required: true,
    type: "text" as const,
    autoComplete: "given-name",
  },
  lastName: {
    id: "contact-last-name",
    name: "lastName",
    label: "Last Name",
    placeholder: "Nawaz",
    required: true,
    type: "text" as const,
    autoComplete: "family-name",
  },
  email: {
    id: "contact-email",
    name: "email",
    label: "Email",
    placeholder: "test@gmail.com",
    required: true,
    type: "email" as const,
    autoComplete: "email",
  },
  phone: {
    id: "contact-phone",
    name: "phone",
    label: "Phone No",
    placeholder: "+123 456 789 00",
    required: false,
    type: "tel" as const,
    autoComplete: "tel",
  },
  subject: {
    id: "contact-subject",
    name: "subject",
    label: "Subject",
    placeholder: "Enquiry ....",
    required: false,
    type: "text" as const,
    autoComplete: "off",
  },
  message: {
    id: "contact-message",
    name: "message",
    label: "Message",
    placeholder: "Enter message here...",
    required: true,
  },
  submitLabel: "Send Message",
} as const;
