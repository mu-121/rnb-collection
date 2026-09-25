import { Suspense } from "react";
import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import {
  ShopCatalogSection,
  ShopHeroSection,
} from "@/components/ShopPage";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — RnB Collection",
  description:
    "Elevate your daily wardrobe with ease. Explore handpicked modern silhouettes.",
};

export default function Shop() {
  return (
    <>
      <AnnouncementBar />
      <div className="hero-shell">
        <Header />
        <main>
          <ShopHeroSection />
        </main>
      </div>
      <Suspense fallback={<p className="shop-catalog__status">Loading products...</p>}>
        <ShopCatalogSection />
      </Suspense>
      <SocialGallery />
      <Footer />
    </>
  );
}
