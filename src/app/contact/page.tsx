import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import {
  ContactBodySection,
  ContactHeroSection,
} from "@/components/ContactPage";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact — RnB Collection",
  description:
    "Contact us today for refined service designed for our discerning fashion community.",
};

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <div className="hero-shell">
        <Header />
        <main>
          <ContactHeroSection />
        </main>
      </div>
      <ContactBodySection />
      <SocialGallery />
      <Footer />
    </>
  );
}
