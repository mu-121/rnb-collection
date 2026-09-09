export type Feature = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: [string, string];
};

export const features: Feature[] = [
  {
    id: "f-01",
    title: "Everyday Comfort",
    description: "Designed to feel natural on the body throughout long, active days.",
    tags: ["All-day wear", "Comfort", "Relaxed fit"],
    images: ["/Images/wearix-129.jpg", "/Images/wearix-132.jpg"],
  },
  {
    id: "f-02",
    title: "Modern Silhouettes",
    description:
      "Contemporary shapes balance structure & ease for confident everyday styling.",
    tags: ["Balanced fit", "Modern", "Structured"],
    images: ["/Images/wearix-135.png", "/Images/wearix-136.jpg"],
  },
  {
    id: "f-03",
    title: "Effortless Styling",
    description:
      "Pieces work together naturally, making daily outfit choices simple & intuitive.",
    tags: ["Verstile", "Easy to style", "Layered"],
    images: ["/Images/wearix-138.jpg", "/Images/wearix-141.jpg"],
  },
  {
    id: "f-04",
    title: "Daily Essentials",
    description:
      "Core clothing pieces designed for frequent wear across modern everyday routines.",
    tags: ["Core pieces", "Everyday", "Wearable"],
    images: ["/Images/wearix-143.png", "/Images/wearix-144.png"],
  },
  {
    id: "f-05",
    title: "Wearable Design",
    description:
      "Design decisions focused on comfort, fit, and real-life wearability.",
    tags: ["Practical", "Functional", "Adaptable"],
    images: ["/Images/wearix-146.jpg", "/Images/wearix-148.png"],
  },
  {
    id: "f-06",
    title: "Clean Aesthetic",
    description: "Designed to feel natural on the body throughout long, active days.",
    tags: ["Clean lines", "Minimal", "Timeless"],
    images: ["/Images/wearix-150.jpg", "/Images/wearix-153.jpg"],
  },
];
