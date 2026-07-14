import HeroSection from "../../components/home/HeroSection";
import LatestJobsSection from "../../components/home/LatestJobsSection";
import PopularCategoriesSection from "../../components/home/PopularCategoriesSection";
import StatisticsSection from "../../components/home/StatisticsSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestJobsSection />
      <PopularCategoriesSection />
      <WhyChooseUsSection />
      <StatisticsSection />
      <TestimonialsSection />
    </>
  );
}