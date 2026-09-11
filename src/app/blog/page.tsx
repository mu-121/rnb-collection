import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import {
  BlogCatalogSection,
  BlogHeroSection,
} from "@/components/BlogPage";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog — RnB Collection",
  description:
    "Discover the detailed process of creating premium garments from our sustainable materials.",
};

export default function BlogPage() {
  return (
    <>
      <AnnouncementBar />
      <div className="hero-shell">
        <Header />
        <main>
          <BlogHeroSection />
        </main>
      </div>
      <BlogCatalogSection />
      <SocialGallery />
      <Footer />
    </>
  );
}
