import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RnB Collection",
  description: "Premium wear for modern living",
  icons: {
    icon: [{ url: "/Favicon.png", type: "image/png" }],
    shortcut: "/Favicon.png",
    apple: "/Favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
