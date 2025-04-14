"use client";

import React from 'react';
import Image from 'next/image';
import Container from '@/components/common/Container'; // Use the standard container
import Link from 'next/link'; // Import Link for potential actions
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge"; // Import Badge

interface FeatureItem {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  tag?: string; // Added optional tag
  // action prop is no longer used for clickability
  action?: string; // Optional URL or action identifier for the feature
  // Add i18n sub-keys if needed
}

interface FeatureSectionWithSplitImagesProps {
  i18nBaseKey?: string; // For potential i18n integration
  sectionTag?: string; // Optional tag above the title
  sectionTitle: string;
  sectionDescription?: string; // Optional description/subtitle below title
  features: FeatureItem[];
}

const FeatureSectionWithSplitImages = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  i18nBaseKey,
  sectionTag,
  sectionTitle,
  sectionDescription,
  features = [], // Default to empty array
}: FeatureSectionWithSplitImagesProps) => {
  // TODO: Add useTranslations hook if i18nBaseKey is provided

  return (
    <section className="py-24 md:py-32"> {/* Adjusted padding */}
      <Container>
        {sectionTag && (
            <h4 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-primary"> {/* Adjusted tag style */}
                {sectionTag}
            </h4>
        )}
        {sectionTitle && (
            <h2 className="mx-auto mb-12 max-w-3xl text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"> {/* Standardized h2 */}
                {sectionTitle}
            </h2>
        )}
         {sectionDescription && ( // Added optional description rendering
          <p className="mx-auto mb-16 max-w-3xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
            {sectionDescription}
          </p>
        )}
        <div className={cn(
          "grid grid-cols-1 gap-x-8 gap-y-12",
          features.length === 2 ? "md:grid-cols-2" : "", // Handle 2 columns
          features.length === 3 ? "md:grid-cols-3" : "", // Handle 3 columns
          features.length >= 4 ? "md:grid-cols-4" : ""  // Handle 4 columns (or default)
        )}>
          {features.map((item, index) => {
            const isInternalLink = item.action?.startsWith('/');
            const baseClassName = "group block";
            const hoverClassName = item.action ? "transition-opacity duration-300 hover:opacity-80" : "";

            if (item.action) {
              if (isInternalLink) {
                // Use Next/Link for internal links
                return (
                  <Link
                    key={index}
                    href={item.action} // Pass href directly
                    className={cn(baseClassName, hoverClassName)}
                    aria-label={item.title}
                  >
                    <div className="relative mb-6 aspect-[1.5] w-full overflow-hidden rounded-2xl">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt || item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    {item.tag && (
                      <Badge variant="outline" className="mb-2">{item.tag}</Badge>
                    )}
                    <h3 className="mb-2 text-xl font-semibold dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground">
                       {item.description}
                     </p>
                  </Link>
                );
              } else {
                // Use <a> for external links
                return (
                  <a
                    key={index}
                    href={item.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(baseClassName, hoverClassName)}
                    aria-label={item.title}
                  >
                    <div className="relative mb-6 aspect-[1.5] w-full overflow-hidden rounded-2xl">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt || item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    {item.tag && (
                      <Badge variant="outline" className="mb-2">{item.tag}</Badge>
                    )}
                    <h3 className="mb-2 text-xl font-semibold dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground">
                       {item.description}
                     </p>
                  </a>
                );
              }
            } else {
              // Use <div> for non-clickable items
              return (
                <div key={index} className={baseClassName}>
                  <div className="relative mb-6 aspect-[1.5] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt || item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {item.tag && (
                    <Badge variant="outline" className="mb-2">{item.tag}</Badge>
                  )}
                  <h3 className="mb-2 text-xl font-semibold dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted-foreground">
                     {item.description}
                   </p>
                </div>
              );
            }
          })}
        </div>
      </Container>
    </section>
  );
};

export default FeatureSectionWithSplitImages;