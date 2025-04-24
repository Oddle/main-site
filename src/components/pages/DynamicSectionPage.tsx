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
            // Add logging
            console.log(`[DynamicSectionPage] Rendering section ${index}: ${section.component}, Locale: ${locale}, PageURL: ${pageUrl}`);
            
            const Component = componentMap[section.component as keyof typeof componentMap];
            if (!Component) {
              // Log error if component not found
              console.error(`[DynamicSectionPage] Component NOT FOUND in map: ${section.component}`);
              return <div key={index}>Error: Component {section.component} not found.</div>; // Render error placeholder
            }

            // Prepare props 
            const combinedProps = {
                ...section.props,
                locale: locale,
                ...(section.component === 'FaqSection' && { pageUrl: pageUrl }),
            };

            const DynamicComponent = Component as React.ComponentType<any>;

            try {
              // Render the actual section component within a try...catch
              const renderedSection = <DynamicComponent {...combinedProps} />;
              // Log success just before returning the element
              console.log(`[DynamicSectionPage] Successfully prepared to render: ${section.component}`);
              
              // Wrap first section with animated grid
              if (index === 0) {
                return (
                  <div key={index} className="relative overflow-hidden"> 
                    <AnimatedGridPattern
                      numSquares={30}
                      maxOpacity={0.1} // Adjusted maxOpacity for subtlety
                      duration={3}
                      className={cn(
                        "[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_100%)]", // Simplified mask
                        "absolute inset-0 h-full w-full skew-y-12", // Position behind content
                      )}
                    />
                    <div className="relative z-10">
                      {renderedSection}
                    </div>
                  </div>
                );
              } else {
                return <div key={index}>{renderedSection}</div>; 
              }
            } catch (error) {
              // Log any errors during component rendering
              console.error(`[DynamicSectionPage] Error rendering component: ${section.component}`, error);
              return <div key={index}>Error rendering {section.component}.</div>; // Render error placeholder
            }
          })}
      </main>
      <Footer />
    </div>
  );
}

export default DynamicSectionPage;
