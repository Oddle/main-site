import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper
import Container from "@/components/common/Container"; // Import Container

// --- Define interfaces for the data structure ---
interface FeatureItem {
  title: string;
  description: string;
  items?: string[]; // Added: Optional array for list items
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number; // Optional, for better Image optimization if known
  imageHeight?: number; // Optional
  buttonText?: string; // Optional button
  buttonAction?: string; // Action for the button (URL or identifier)
  translationSubKey: string;
}

interface FeatureSectionWithImagesProps {
  i18nBaseKey: string;
  sectionTitle: string;
  sectionDescription: string;
  features: FeatureItem[];
}

// --- Helper function for button clicks (similar to HeroWithCarousel) ---
const handleButtonClick = (action: string | undefined) => {
  if (!action) return;
  if (action.startsWith('/')) {
    window.location.href = action;
  } else {
    console.log('Button action:', action);
  }
};

// --- The Component ---
export default function FeatureSectionWithImages({
  i18nBaseKey,
  sectionTitle: defaultSectionTitle,
  sectionDescription: defaultSectionDescription,
  features = [], // Default to empty array
}: FeatureSectionWithImagesProps) {
  const t = useTranslations();

  // Translate section header using imported helper
  const sectionTitle = getTranslation(t, `${i18nBaseKey}.title`, defaultSectionTitle);
  const sectionDescription = getTranslation(t, `${i18nBaseKey}.description`, defaultSectionDescription);

  return (
    <section className="py-24 space-y-24">
      <Container>
        {/* Section Header */}
        {(sectionTitle || sectionDescription) && (
            <div className="text-center space-y-4 mb-16">
              {sectionTitle && (
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {sectionTitle}
                  </h2>
              )}
              {sectionDescription && (
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {sectionDescription}
                  </p>
              )}
            </div>
        )}

        {/* Features List */}
        <div className="space-y-24">
          {features.map((feature: FeatureItem, index: number) => {
            // Use index directly to construct the base key for this feature
            const featureBaseKey = `${i18nBaseKey}.features.${index}`; 

            // Translate feature properties using the index-based key
            const featureTitle = getTranslation(t, `${featureBaseKey}.title`, feature.title);
            const featureDescription = getTranslation(t, `${featureBaseKey}.description`, feature.description);
            const featureImageAlt = getTranslation(t, `${featureBaseKey}.imageAlt`, feature.imageAlt);
            const featureButtonText = feature.buttonText 
              ? getTranslation(t, `${featureBaseKey}.buttonText`, feature.buttonText) 
              : undefined;
              
            // Translate items array - KEEPING EXISTING LOGIC (item1, item2...)
            // This assumes the JSON structure for items remains like "item1", "item2"
            const translatedItems = feature.items?.map((item: string, itemIndex: number) => 
              getTranslation(t, `${featureBaseKey}.item${itemIndex + 1}`, item)
            ) || [];

            return (
              <div
                key={index} // Use index as the React key
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Text Content (Always on the left on large screens) */}
                <div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{featureTitle}</h3>
                    <p className="text-muted-foreground">{featureDescription}</p>
                    {/* Added: Render list items if they exist */}
                    {translatedItems.length > 0 && (
                      <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                        {translatedItems.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {featureButtonText && (
                      <Button onClick={() => handleButtonClick(feature.buttonAction)}>
                        {featureButtonText}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Image */}
                <div className="relative aspect-video overflow-hidden"> {/* Re-added aspect-video */}
                  <Image
                    src={feature.imageSrc}
                    alt={featureImageAlt}
                    fill
                    className="object-contain object-center" // Changed object-cover to object-contain
                    width={feature.imageWidth}
                    height={feature.imageHeight}
                    priority={index === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
} 