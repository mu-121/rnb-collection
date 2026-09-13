import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import BrandStory from "@/components/BrandStory";
import BestSellers from "@/components/BestSellers";
import Collections from "@/components/Collections";
import CustomerReviews from "@/components/CustomerReviews";
import Features from "@/components/Features";
import Blog from "@/components/Blog";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <div className="hero-shell">
        <Header />
        <main>
          <Hero />
        </main>
      </div>
      <NewArrivals />
      <BrandStory />
      <BestSellers />
      <Collections />
      <CustomerReviews />
      <Features />
      <Blog />
      <SocialGallery />
      <Footer />
    </>
  );
}
