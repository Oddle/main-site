"use client";
import dynamic from 'next/dynamic'; // Import dynamic
import NavBar from "../common/NavBar";
import React from 'react';
import Footer from "../common/Footer";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

const UtmTracker = dynamic(() => import('@/components/UTMTracker').then(mod => mod.UtmTracker), {
  ssr: false,
});

export interface SectionDefinition {
  component: string;
  props?: Record<string, unknown>;
}

interface DynamicSectionPageProps {
  sectionsData: SectionDefinition[];
  pageUrl: string;
  locale: string;
}

// --- Component Map with Dynamic Imports --- 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: { [key: string]: React.ComponentType<any> } = {
  HeroWithCarousel: dynamic(() => import("@/components/sections/HeroWithCarousel")),
  IconSectionHorizontal: dynamic(() => import("@/components/sections/IconSectionHorizontal")),
  HeroSectionWithAppShowcase: dynamic(() => import("@/components/sections/HeroSectionWithAppShowcase")),
  FeatureSectionWithImages: dynamic(() => import("@/components/sections/FeatureSectionWithImages")),
  FaqSection: dynamic(() => import("@/components/sections/FaqSection")),
  FeatureSectionWithSubpoints: dynamic(() => import("@/components/sections/FeatureSectionWithSubpoints")),
  FeatureSectionWithSplitImages: dynamic(() => import("@/components/sections/FeatureSectionWithSplitImages")),
  FeatureSectionWithColumns: dynamic(() => import("@/components/sections/FeatureSectionWithColumns")),
  FeatureSectionWithTabs: dynamic(() => import("../sections/FeatureSectionWithTabs")),
  FeatureSectionWithAccordion: dynamic(() => import("../sections/FeatureSectionWithAccordion")),
  FeatureSectionAlternating: dynamic(() => import("../sections/FeatureSectionAlternating")),
  FeatureSectionBentoGrid: dynamic(() => import("../sections/FeatureSectionBentoGrid")),
  CustomerLogosSection: dynamic(() => import("../sections/CustomerLogosSection")),
  DemoRequestSection: dynamic(() => import("../sections/DemoRequestSection")),
  CallToActionSection: dynamic(() => import("../sections/CallToActionSection")),
  FeatureSectionOverlapImage: dynamic(() => import("../sections/FeatureSectionOverlapImage")),
  CustomerTestimonialsSection: dynamic(() => import('@/components/sections/CustomerTestimonialsSection')),
  FeatureSectionWithGridImages: dynamic(() => import('@/components/sections/FeatureSectionWithGridImages')),
  // Add other section components here with dynamic imports
};

const DynamicSectionPage = ({ sectionsData, pageUrl, locale }: DynamicSectionPageProps) => {
  // Add check for undefined sectionsData
  if (!sectionsData || !Array.isArray(sectionsData)) {
    console.error('[DynamicSectionPage] sectionsData is undefined or not an array');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <UtmTracker /> {/* Use the dynamically imported component */}
      <NavBar />
      <main className="flex-1">
        {sectionsData.map((section, index) => {
            const Component = componentMap[section.component as keyof typeof componentMap];
            if (!Component) {
              // Log error if component not found
              return <div key={index}>Error: Component {section.component} not found.</div>; // Render error placeholder
            }

            // Prepare props 
            const combinedProps = {
                ...section.props,
                locale: locale,
                ...(section.component === 'FaqSection' && { pageUrl: pageUrl }),
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const DynamicComponent = Component as React.ComponentType<any>;

            try {
              // Render the actual section component within a try...catch
            const renderedSection = <DynamicComponent {...combinedProps} />;
              // Log success just before returning the element

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
            } catch (_error) { // Prefix error with underscore
              // Log any errors during component rendering
              console.error(`[DynamicSectionPage] Error rendering component: ${section.component}`, _error);
              return <div key={index}>Error rendering {section.component}.</div>; // Render error placeholder
            }
          })}
      </main>
      <Footer />
    </div>
  );
}

export default DynamicSectionPage;
