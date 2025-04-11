import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

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
}

interface FeatureSectionWithImagesProps {
  sectionTitle: string;
  sectionDescription: string;
  features: FeatureItem[];
}

// --- Helper function for button clicks (similar to ProductCarouselHero) ---
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
  sectionTitle,
  sectionDescription,
  features = [], // Default to empty array
}: FeatureSectionWithImagesProps) {
  return (
    <section className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 space-y-24">
      {/* Section Header */}
      {(sectionTitle || sectionDescription) && (
          <div className="text-center space-y-4">
            {sectionTitle && (
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
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
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text Content (Always on the left on large screens) */}
            <div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                {/* Added: Render list items if they exist */}
                {feature.items && feature.items.length > 0 && (
                  <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                    {feature.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {feature.buttonText && (
                  <Button onClick={() => handleButtonClick(feature.buttonAction)}>
                    {feature.buttonText}
                  </Button>
                )}
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg"> {/* Added shadow */}
              <Image
                src={feature.imageSrc}
                alt={feature.imageAlt}
                fill // Keep fill as per reference, ensure parent has relative positioning and dimensions
                className="object-cover object-center"
                // Add optional width/height if provided for potential optimization, but fill handles sizing
                width={feature.imageWidth}
                height={feature.imageHeight}
                // Consider adding priority based on which image is likely LCP
                priority={index === 0} // Example: Prioritize the first image
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 