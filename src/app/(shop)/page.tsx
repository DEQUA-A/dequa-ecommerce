import { prisma } from "@/lib/db";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FlashSaleBanner } from "@/components/home/FlashSaleBanner";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { TrustSection } from "@/components/home/TrustSection";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default async function HomePage() {
  const [featured, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE", featured: true },
      include: { images: true, category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const heroBrands = brands.slice(0, 6);

  return (
    <>
      <HeroSection brands={heroBrands} />
      <BrandShowcase brands={brands} />
      <FeaturedProducts products={featured} />
      <CategoryShowcase categories={categories} />
      <FlashSaleBanner />
      <TrustSection />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
