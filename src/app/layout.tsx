import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RnB Collection",
  description: "Premium wear for modern living",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
