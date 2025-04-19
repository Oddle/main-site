"use client";

import Image from 'next/image';
import Link from 'next/link'; // Use Next Link for internal links
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';

import { getTranslation } from '@/lib/i18nUtils';
import Container from '@/components/common/Container';

// Interface for individual grid items
interface GridItemData { // Renamed from FeatureItem
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

// Interface for the component props - Standardized
interface FeatureSectionHeroGridProps {
  i18nBaseKey: string;
  title: string; // Renamed from heading, required
  description?: string; // Standard optional prop
  linkUrl?: string | null; // Specific optional prop
  linkText?: string | null; // Specific optional prop
  items: GridItemData[]; // Renamed from features, required
}

const FeatureSectionHeroGrid = ({
  i18nBaseKey,
  title: defaultTitle, // Renamed from heading
  description: defaultDescription,
  linkUrl,
  linkText: defaultLinkText,
  items, // Renamed from features, now required
}: FeatureSectionHeroGridProps) => {
  const t = useTranslations();

  // Translate props using standard names
  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = defaultDescription ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription) : undefined;
  const linkText = defaultLinkText ? getTranslation(t, `${i18nBaseKey}.linkText`, defaultLinkText) : null;

  // No need to check for empty items as it's required
  // if (!items || items.length === 0) {
  //   if (!title && !description) return null;
  // }

  // Use items array
  const firstItem = items[0];
  const remainingItems = items.slice(1);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
          {/* Header */}
          <div className="lg:max-w-md xl:max-w-lg">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mb-4 lg:mb-6">
              {title} {/* Use title */}
            </h2>
            {description && (
              <p className="mb-6 text-base text-muted-foreground lg:mb-8 lg:text-lg">{description}</p>
            )}
            {linkUrl && linkText && (
              <Link
                href={linkUrl}
                className="group inline-flex items-center text-base font-medium text-primary hover:text-primary/80"
              >
                {linkText}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Grid - Use items */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {/* First Item (Spans 2 columns) */}
            {firstItem && (
              <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card dark:bg-slate-800/50 shadow-sm md:col-span-2 md:grid md:grid-cols-2 md:gap-0">
                <div className="relative md:min-h-[24rem] lg:min-h-[28rem] xl:min-h-[32rem]">
                  <Image
                    src={firstItem.imageSrc}
                    alt={getTranslation(t, `${i18nBaseKey}.items.0.imageAlt`, firstItem.imageAlt)} // Use items key
                    fill
                    className="aspect-[16/9] h-full w-full object-cover object-center md:aspect-auto"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                  <h3 className="mb-3 text-xl font-semibold md:mb-4 md:text-2xl lg:mb-6">
                    {getTranslation(t, `${i18nBaseKey}.items.0.title`, firstItem.title)} {/* Use items key */}
                  </h3>
                  <p className="text-base text-muted-foreground lg:text-lg">
                    {getTranslation(t, `${i18nBaseKey}.items.0.description`, firstItem.description)} {/* Use items key */}
                  </p>
                </div>
              </div>
            )}

            {/* Remaining Items */}
            {remainingItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card dark:bg-slate-800/50 shadow-sm"
              >
                <div className="relative aspect-video w-full">
                  <Image
                    src={item.imageSrc}
                    alt={getTranslation(t, `${i18nBaseKey}.items.${index + 1}.imageAlt`, item.imageAlt)} // Use items key
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-grow flex-col p-6 md:p-8 lg:p-10">
                  <h3 className="mb-3 text-xl font-semibold md:mb-4 md:text-2xl lg:mb-6">
                    {getTranslation(t, `${i18nBaseKey}.items.${index + 1}.title`, item.title)} {/* Use items key */}
                  </h3>
                  <p className="text-base text-muted-foreground lg:text-lg">
                    {getTranslation(t, `${i18nBaseKey}.items.${index + 1}.description`, item.description)} {/* Use items key */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeatureSectionHeroGrid; 