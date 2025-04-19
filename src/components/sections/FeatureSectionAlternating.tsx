"use client";

import Image from 'next/image';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import Container from '@/components/common/Container';
import { getTranslation } from '@/lib/i18nUtils';

// Interface for individual feature items
interface AlternatingGridItemData {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition: 'left' | 'right'; // Image on left or right of text within the card
  linkText?: string | null;
  linkAction?: string | null;
}

// Interface for the component props - Standardized
interface FeatureSectionAlternatingProps {
  i18nBaseKey: string;
  title: string;
  description?: string | null;
  items: AlternatingGridItemData[];
}

const FeatureSectionAlternating = ({
  i18nBaseKey,
  title: defaultTitle,
  description: defaultDescription,
  items,
}: FeatureSectionAlternatingProps) => {
  const t = useTranslations();

  // Translate top-level props
  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = defaultDescription ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription) : undefined;

  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        {/* Header Section */}
        <div className="mb-12 text-center md:mb-16">
          {/* sectionTag could be added here if needed later */}
          {title && (
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
        {/* End Header Section */}

        {/* Grid Layout - Changed from space-y to grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {items.map((item, index) => {
            // Translate item props
            const itemTitle = getTranslation(t, `${i18nBaseKey}.items.${index}.title`, item.title);
            const itemDescription = getTranslation(t, `${i18nBaseKey}.items.${index}.description`, item.description);
            const itemImageAlt = getTranslation(t, `${i18nBaseKey}.items.${index}.imageAlt`, item.imageAlt);
            const itemLinkText = item.linkText ? getTranslation(t, `${i18nBaseKey}.items.${index}.linkText`, item.linkText) : null;

            return (
              // Each item is now a card within the grid
              <div
                key={index}
                className={cn(
                  // Base card styles
                  'flex flex-col overflow-hidden rounded-lg bg-muted dark:bg-slate-800/50 shadow-sm',
                  // Flex direction for internal layout based on imagePosition
                  'md:flex-row',
                  item.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
                )}
              >
                {/* Image Column within the card */}
                {/* Adjusted width and aspect ratio handling */}
                <div className="relative w-full flex-shrink-0 md:w-1/2 aspect-square md:aspect-auto">
                  <Image
                    src={item.imageSrc}
                    alt={itemImageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Text Content Column within the card */}
                {/* Adjusted width and padding */}
                <div className="flex w-full flex-col justify-center gap-3 p-6 md:w-1/2 md:gap-4 lg:p-8">
                  <h3 className="text-lg font-semibold md:text-xl lg:text-2xl">
                    {itemTitle}
                  </h3>
                  
                  {/* Optional Separator */}
                  <div className="h-px w-full bg-border dark:bg-slate-700" /> 

                  <p className="text-sm text-muted-foreground md:text-base">
                    {itemDescription}
                  </p>

                  {itemLinkText && item.linkAction && (
                    <Link
                      href={item.linkAction}
                      // Adjusted text size slightly
                      className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <span>{itemLinkText}</span>
                      <MoveRight strokeWidth={2} className="ml-1.5 size-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default FeatureSectionAlternating; 