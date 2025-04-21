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
import CustomerLogosSection from "../sections/CustomerLogosSection";
import DemoRequestSection from "../sections/DemoRequestSection";
import CallToActionSection from "../sections/CallToActionSection";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
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
  CustomerLogosSection,
  DemoRequestSection,
  CallToActionSection,
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

            // Prepare props: Start with props from JSON, add dynamic ones needed by specific components
            const combinedProps = {
                ...section.props, // Props defined in pageSections.json
                locale: locale,   // Always pass locale
                // Add pageUrl specifically if the component needs it (like FaqSection)
                ...(section.component === 'FaqSection' && { pageUrl: pageUrl }),
                // Add other dynamic props needed by specific components here
            };

            // Pass props directly
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const DynamicComponent = Component as React.ComponentType<any>;

            // Render the actual section component
            const renderedSection = <DynamicComponent {...combinedProps} />;

            // If it's the first section, wrap it with the animated grid
            if (index === 0) {
              return (
                <div key={index} className="relative overflow-hidden"> {/* Wrapper for first section */} 
                  <AnimatedGridPattern
                    numSquares={30}
                    maxOpacity={0.1} // Adjusted maxOpacity for subtlety
                    duration={3}
                    className={cn(
                      "[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_100%)]", // Simplified mask
                      "absolute inset-0 h-full w-full skew-y-12", // Position behind content
                    )}
                  />
                  {/* Render section content on top */} 
                  <div className="relative z-10">
                    {renderedSection}
                  </div>
                </div>
              );
            } else {
              // For subsequent sections, render without the wrapper
              return <div key={index}>{renderedSection}</div>; 
              // Note: Adding a key here is good practice if not already handled within DynamicComponent
            }
          })}
      </main>
      <Footer />
    </div>
  );
}

export default DynamicSectionPage;
