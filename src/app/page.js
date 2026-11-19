import { Suspense } from "react";
import HeroSection from "@/components/homepage/banner";
import BecomeVendor from "@/components/homepage/BecomeVendor";
import FeaturedPizzas from "@/components/homepage/FeaturedPizzas";
import Footer from "@/components/homepage/Footer";
import HowItWorks from "@/components/homepage/HowItWorks";
import Newsletter from "@/components/homepage/Newsletter";
import PopularCategories from "@/components/homepage/PopularCategories";
import Reviews from "@/components/homepage/Reviews";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  return (
    <>
      <HeroSection />
      <PopularCategories />
      <FeaturedPizzas />
      <WhyChooseUs />
      <HowItWorks />
      <BecomeVendor />
      <Reviews />
      <Newsletter />
      <Footer />
    </>
  );
}
