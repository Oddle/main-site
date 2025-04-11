"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import NavBar from "../common/NavBar";
import ProductCarouselHero from "@/components/sections/ProductCarouselHero";
import BentoGridSection from "@/components/sections/BentoGridSection";
import ABCSection from "@/components/sections/ABCSection";
import HeroSectionWithAppShowcase from "@/components/sections/HeroSectionWithAppShowcase";
import FeatureSectionWithImages from "@/components/sections/FeatureSectionWithImages";
import React from 'react'; // Import React for ComponentType typing

// --- Define type for section data --- (Good practice)
interface SectionDefinition {
  component: string; // Ideally keyof typeof componentMap, but string is simpler for now
  props: Record<string, unknown>; // Keep props flexible
}

// --- Props for the component ---
interface DynamicSectionPageProps {
  sectionsData: SectionDefinition[];
}

// --- Component Map --- (Ensure keys match component names in JSON)
const componentMap = {
  ProductCarouselHero,
  ABCSection,
  BentoGridSection,
  HeroSectionWithAppShowcase,
  FeatureSectionWithImages,
};

// Update component signature to accept props
export default function DynamicSectionPage({ sectionsData }: DynamicSectionPageProps) {
  const f = useTranslations("Footer");
  const t = useTranslations(); // Use default namespace for section content

  // Recursive function to translate all string values
  const translateAllStrings = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return t(value);
    } else if (Array.isArray(value)) {
      return value.map(item => translateAllStrings(item));
    } else if (typeof value === 'object' && value !== null) {
      const translatedObject: Record<string, unknown> = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          translatedObject[key] = translateAllStrings((value as Record<string, unknown>)[key]);
        }
      }
      return translatedObject;
    }
    return value;
  };

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

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const translatedProps = translateAllStrings(section.props) as Record<string, any>;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const DynamicComponent = Component as React.ComponentType<any>;

          return <DynamicComponent key={index} {...translatedProps} />;
        })}
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {f("copyright")}
        </p>
        <nav className=" flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 hover:text-primary transition-colors duration-200"
            href="https://github.com/S0vers/i18n-Nextjs-BoilerPlate"
            target="_blank"
            rel="noopener noreferrer"
          >
            {f("githubLink")}
          </Link>
        </nav>
      </footer>
    </div>
  );
}
