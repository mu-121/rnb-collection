import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogEmpty from "@/components/CatalogEmpty";

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <div className="hero-shell hero-shell--plain">
        <Header />
        <main className="catalog-empty-page">
          <CatalogEmpty
            title="Page not found"
            body="This product or page is not available. It may be unpublished, or the link may be out of date."
            href="/shop"
            cta="Back to shop"
          />
        </main>
      </div>
      <Footer />
    </>
  );
}
