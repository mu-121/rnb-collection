import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import ProductDetailPage from "@/components/ProductDetailPage";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";
import {
  getAllProductSlugs,
  getProductDetail,
} from "@/data/productDetails";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetail(slug);
  if (!product) {
    return { title: "Product — RnB Collection" };
  }
  return {
    title: `${product.name} — RnB Collection`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductDetail(slug);
  if (!product) notFound();

  return (
    <>
      <AnnouncementBar />
      <div className="hero-shell hero-shell--product">
        <Header />
      </div>
      <main>
        <ProductDetailPage product={product} />
      </main>
      <SocialGallery />
      <Footer />
    </>
  );
}
