"use client";
import NavBar from "../common/NavBar";
import HeroWithCarousel from "@/components/sections/HeroWithCarousel";
import IconSectionHorizontal from "@/components/sections/IconSectionHorizontal";
import HeroSectionWithAppShowcase from "@/components/sections/HeroSectionWithAppShowcase";
import FeatureSectionWithImages from "@/components/sections/FeatureSectionWithImages";
import FaqSection from "@/components/sections/FaqSection";
import React from 'react';
import Footer from "../common/Footer";
import TimelineSection from "@/components/sections/TimelineSection";
import FeatureSectionWithSubpoints from "@/components/sections/FeatureSectionWithSubpoints";
import FeatureSectionWithSplitImages from "@/components/sections/FeatureSectionWithSplitImages";
import FeatureSectionWithColumns from "@/components/sections/FeatureSectionWithColumns";
import FeatureSectionWithTabs from "../sections/FeatureSectionWithTabs";
import FeatureSectionWithAccordion from "../sections/FeatureSectionWithAccordion";
import FeatureSectionGridCards from "../sections/FeatureSectionGridCards";
import FeatureSectionAlternating from "../sections/FeatureSectionAlternating";
import FeatureSectionComplexGrid from "../sections/FeatureSectionComplexGrid";
import FeatureSectionHeroGrid from "../sections/FeatureSectionHeroGrid";
import FeatureSectionBentoGrid from "../sections/FeatureSectionBentoGrid";
// --- Define type for section data --- (Good practice)
interface SectionDefinition {
  component: string; // Ideally keyof typeof componentMap, but string is simpler for now
  props?: Record<string, unknown>; // Props are optional, especially for components like FaqSection that get dynamic ones
}

// --- Props for the component ---
interface DynamicSectionPageProps {
  sectionsData: SectionDefinition[];
  pageUrl: string; // Add pageUrl prop
  locale: string; // Add locale prop
}

// --- Component Map --- (Ensure keys match component names in JSON)
const componentMap = {
  HeroWithCarousel,
  IconSectionHorizontal,
  HeroSectionWithAppShowcase,
  FeatureSectionWithImages,
  FaqSection, // Add FaqSection to the map
  TimelineSection,    
  FeatureSectionWithSubpoints,
  FeatureSectionWithSplitImages,
  FeatureSectionWithColumns,
  FeatureSectionWithTabs,
  FeatureSectionWithAccordion,
  FeatureSectionGridCards,
  FeatureSectionAlternating,
  FeatureSectionComplexGrid,
  FeatureSectionHeroGrid,
  FeatureSectionBentoGrid,
};

// Removed the processProps function

// Update component signature to accept props
const DynamicSectionPage = ({ sectionsData, pageUrl, locale }: DynamicSectionPageProps) => {
  // console.log("[DynamicSectionPage] Received props:", { pageUrl, locale, sectionsData });

  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />
      <main className="flex-1">
        {sectionsData.map((section, index) => {
            const Component = componentMap[section.component as keyof typeof componentMap];
            if (!Component) {
              console.warn(`Component ${section.component} not found in componentMap`);
              return null;
            }

            // Prepare props, starting with those from JSON (if any)
            let combinedProps = { ...section.props };

            // If it's the FaqSection, add the dynamic pageUrl and locale props
            if (section.component === 'FaqSection') {
              combinedProps = {
                ...combinedProps, // Keep any static props defined in JSON (though unlikely for FaqSection)
                pageUrl: pageUrl,
                locale: locale,
              };
            }

            // Pass props directly
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const DynamicComponent = Component as React.ComponentType<any>;

            return <DynamicComponent key={index} {...combinedProps} />;
          })}
      </main>
      <Footer />
    </div>
  );
}

export default DynamicSectionPage;
