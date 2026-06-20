import HeroSlider from "@/components/home/HeroSlider";
import FeaturedLessons from "@/components/home/FeaturedLessons";
import WhyLearnSection from "@/components/home/WhyLearnSection";
import { TopContributors, MostSavedLessons } from "@/components/home/DynamicSections";

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <FeaturedLessons />
      <WhyLearnSection />
      <TopContributors />
      <MostSavedLessons />
    </div>
  );
}
