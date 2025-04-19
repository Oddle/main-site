"use client";

import React from 'react';
import Image from 'next/image';
import Container from '@/components/common/Container';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';

// Interface for individual feature items
interface StandardItemData {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  tag?: string;
  action?: string;
}

// Standardized Props interface
interface FeatureSectionWithColumnsProps {
  i18nBaseKey?: string;
  tag?: string | null;
  title: string;
  description?: string | null;
  items: StandardItemData[];
}

// Component function
const FeatureSectionWithColumns = ({
  i18nBaseKey,
  tag: defaultTag,
  title: defaultTitle,
  description: defaultDescription,
  items = [],
}: FeatureSectionWithColumnsProps) => {
  const t = useTranslations();

  const tag = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.tag`, defaultTag ?? '') : defaultTag;
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;
  const description = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription ?? '') : defaultDescription;

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Title and Description Section */}
        <div className="text-center max-w-3xl mx-auto">
          {tag && (
            <h4 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-primary">
              {tag}
            </h4>
          )}
          {title && (
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mb-12 text-lg leading-8 text-gray-600 dark:text-gray-300 lg:mb-16">
              {description}
            </p>
          )}
        </div>

        {/* Items Cards Section - Use items */}
        <div className={cn(
          "grid grid-cols-1 gap-x-8 gap-y-12",
          "sm:grid-cols-2",
          items.length === 3 ? "lg:grid-cols-3" : "",
        )}>
          {items.map((item: StandardItemData, index: number) => {
            const itemBaseKey = `${i18nBaseKey}.items.${index}`;

            const itemTitle = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.title`, item.title) : item.title;
            const itemDescription = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.description`, item.description) : item.description;
            const itemTag = item.tag && i18nBaseKey ? getTranslation(t, `${itemBaseKey}.tag`, item.tag) : item.tag;
            const itemImageAlt = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.imageAlt`, item.imageAlt) : item.imageAlt;
            
            const isInternalLink = item.action?.startsWith('/');
            const baseClassName = "group block h-full";
            const hoverClassName = item.action ? "transition-opacity duration-300 hover:opacity-80" : "";

            const cardContent = (
               <Card className="flex h-full flex-col overflow-hidden pt-0 transition-shadow duration-300 group-hover:shadow-lg">
                  <div className="relative aspect-[1.5] w-full">
                      <Image
                        src={item.imageSrc}
                        alt={itemImageAlt || itemTitle}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                  </div>
                  <CardContent className="flex flex-grow flex-col px-4 pb-4 md:px-6 md:pb-6">
                    {itemTag && (
                       <Badge variant="outline" className="mb-2 w-fit">{itemTag}</Badge>
                     )}
                    <h3 className="mb-2 text-xl font-semibold dark:text-white">{itemTitle}</h3>
                    <p className="text-base text-muted-foreground">
                      {itemDescription}
                    </p>
                  </CardContent>
               </Card>
            );

            if (item.action) {
              if (isInternalLink) {
                return (
                  <Link
                    key={index}
                    href={item.action}
                    className={cn(baseClassName, hoverClassName)}
                    aria-label={itemTitle}
                  >
                    {cardContent}
                  </Link>
                );
              } else {
                return (
                  <a
                    key={index}
                    href={item.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(baseClassName, hoverClassName)}
                    aria-label={itemTitle}
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

export default FeatureSectionWithColumns;