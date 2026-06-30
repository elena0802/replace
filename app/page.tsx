import BottomCtaSection from "@/components/BottomCtaSection";
import CollectionsSection from "@/components/CollectionsSection";
import FeaturedPlacesList from "@/components/FeaturedPlacesList";
import HomeHero from "@/components/HomeHero";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <HomeHero />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 py-12 lg:px-8 lg:py-18">
        <FeaturedPlacesList />

        <CollectionsSection />

        <BottomCtaSection />
      </div>
    </div>
  );
}
