import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import {
  AboutHero,
  AboutMission,
  AboutTrust,
} from "@/components/AboutPage";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — RnB Collection",
  description:
    "Timeless design, modern wearability. Know about Wearix — intentional design and essential garments.",
};

export default function About() {
  return (
    <>
      <AnnouncementBar />
      <div className="hero-shell">
        <Header />
        <main>
          <AboutHero />
        </main>
      </div>
      <AboutTrust />
      <AboutMission />
      <SocialGallery />
      <Footer />
    </>
  );
}
