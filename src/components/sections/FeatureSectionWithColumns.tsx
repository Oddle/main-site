"use client";

import React from 'react';
import Image from 'next/image';
import Container from '@/components/common/Container';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Interface for individual feature items
interface FeatureCardItem {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  tag?: string;
  action?: string;
}

// Renamed Props interface
interface FeatureSectionWithColumnsProps {
  i18nBaseKey?: string;
  sectionTag?: string;
  sectionTitle: string;
  sectionSubtitle?: string;
  features: FeatureCardItem[];
}

// Renamed component function
const FeatureSectionWithColumns = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  i18nBaseKey,
  sectionTag,
  sectionTitle,
  sectionSubtitle,
  features = [],
}: FeatureSectionWithColumnsProps) => { // Use renamed Props interface
  // TODO: Add useTranslations hook if i18nBaseKey is provided

  // Removed the console warning specific to 3 features

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Title and Subtitle Section */}
        <div className="text-center max-w-3xl mx-auto">
          {sectionTag && (
            <h4 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-primary">
              {sectionTag}
            </h4>
          )}
          {sectionTitle && (
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {sectionTitle}
            </h2>
          )}
          {sectionSubtitle && (
            <p className="mb-12 text-lg leading-8 text-gray-600 dark:text-gray-300 lg:mb-16">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* Feature Cards Section - Dynamic Columns */}
        <div className={cn(
          "grid grid-cols-1 gap-x-8 gap-y-12", // Always 1 column on smallest screens
          "sm:grid-cols-2", // Default to 2 columns on small screens and up
          features.length === 3 ? "lg:grid-cols-3" : "", // Use 3 columns ONLY if there are exactly 3 features on large screens
          // If you had 4 features and wanted 4 columns, you could add:
          // features.length === 4 ? "lg:grid-cols-4" : ""
        )}>
          {features.map((feature: FeatureCardItem, index: number) => {
            const isInternalLink = feature.action?.startsWith('/');
            const baseClassName = "group block h-full";
            const hoverClassName = feature.action ? "transition-opacity duration-300 hover:opacity-80" : "";

            const cardContent = (
               <Card className="flex h-full flex-col overflow-hidden pt-0 transition-shadow duration-300 group-hover:shadow-lg">
                  <div className="relative aspect-[1.5] w-full">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt || feature.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                  </div>
                  <CardContent className="flex flex-grow flex-col px-4 pb-4 md:px-6 md:pb-6">
                    {feature.tag && (
                       <Badge variant="outline" className="mb-2 w-fit">{feature.tag}</Badge>
                     )}
                    <h3 className="mb-2 text-xl font-semibold dark:text-white">{feature.title}</h3>
                    <p className="text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
               </Card>
            );

            if (feature.action) {
              if (isInternalLink) {
                return (
                  <Link
                    key={index}
                    href={feature.action}
                    className={cn(baseClassName, hoverClassName)}
                    aria-label={feature.title}
                  >
                    {cardContent}
                  </Link>
                );
              } else {
                return (
                  <a
                    key={index}
                    href={feature.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(baseClassName, hoverClassName)}
                    aria-label={feature.title}
                  >
                    {cardContent}
                  </a>
                );
              }
            } else {
              return (
                <div key={index} className={baseClassName}>
                  {cardContent}
                </div>
              );
            }
          })}
        </div>
      </Container>
    </section>
  );
};

// Update the export name
export default FeatureSectionWithColumns;