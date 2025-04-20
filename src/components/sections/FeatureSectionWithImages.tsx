"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React from "react";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper
import Container from "@/components/common/Container"; // Import Container
import { cn } from "@/lib/utils"; // Import cn for conditional classes

// Interface for individual items (Renamed)
interface StandardItemData {
  title: string;
  description: string;
  items?: string[]; // Bullet points
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  buttonText?: string;
  buttonAction?: string;
}

// Standardized props interface
interface FeatureSectionWithImagesProps {
  i18nBaseKey?: string;
  tag?: string | null;
  title: string;
  description?: string | null;
  items: StandardItemData[]; // Renamed from features
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
  tag: defaultTag,
  title: defaultTitle,
  description: defaultDescription,
  items = [], 
}: FeatureSectionWithImagesProps) {
  const t = useTranslations();

  // Translate section header
  const tag = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.tag`, defaultTag ?? '') : defaultTag;
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;
  const description = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription ?? '') : defaultDescription;

  return (
    <section className="py-24 space-y-24">
      <Container>
        {/* Section Header */}
        {(title || description || tag) && (
            <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
              {/* Render tag */}
              {tag && (
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm"
                >
                  {tag}
                </Badge>
              )}
              {title && (
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                  </h2>
              )}
              {description && (
                  <p className="text-muted-foreground md:text-lg/relaxed">
                    {description}
                  </p>
              )}
            </div>
        )}

        {/* Items List */}
        <div className="space-y-24">
          {items.map((item: StandardItemData, index: number) => {
            const itemBaseKey = `${i18nBaseKey}.items.${index}`; 

            // Translate item properties
            const itemTitle = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.title`, item.title) : item.title;
            const itemDescription = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.description`, item.description) : item.description;
            const itemImageAlt = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.imageAlt`, item.imageAlt) : item.imageAlt;
            const itemButtonText = item.buttonText && i18nBaseKey
              ? getTranslation(t, `${itemBaseKey}.buttonText`, item.buttonText)
              : item.buttonText;
              
            // Translate sub-items (bullet points)
            const translatedSubItems = item.items?.map((subItem: string, subItemIndex: number) => 
              i18nBaseKey ? getTranslation(t, `${itemBaseKey}.item${subItemIndex +1}`, subItem) : subItem
            ) || [];

            return (
              <div
                key={index} 
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                  index % 2 !== 0 ? "lg:[&>*:last-child]:order-first" : "" // Move image first for odd indices
                )}
              >
                {/* Text Content */}
                <div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{itemTitle}</h3>
                    <p className="text-muted-foreground">{itemDescription}</p>
                    {/* Render translated list items */}
                    {translatedSubItems.length > 0 && (
                      <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                        {translatedSubItems.map((subItem: string, idx: number) => (
                          <li key={idx}>{subItem}</li>
                        ))}
                      </ul>
                    )}
                    {itemButtonText && (
                      <Button onClick={() => handleButtonClick(item.buttonAction)}>
                        {itemButtonText}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg"> {/* Changed aspect-video to aspect-square */}
                  <Image
                    src={item.imageSrc}
                    alt={itemImageAlt}
                    fill
                    className="object-contain object-center" // Changed back to object-contain and added object-center
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw" // Adjusted sizes
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