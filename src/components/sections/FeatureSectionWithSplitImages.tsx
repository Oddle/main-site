"use client";

import React from 'react';
import Image from 'next/image';
import Container from '@/components/common/Container';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';

interface SplitImageItemData {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  tag?: string;
  action?: string;
}

interface FeatureSectionWithSplitImagesProps {
  i18nBaseKey: string;
  tag?: string;
  title: string;
  description?: string;
  items: SplitImageItemData[];
}

const FeatureSectionWithSplitImages = ({
  i18nBaseKey,
  tag: defaultTag,
  title: defaultTitle,
  description: defaultDescription,
  items,
}: FeatureSectionWithSplitImagesProps) => {
  const t = useTranslations();

  const tag = defaultTag ? getTranslation(t, `${i18nBaseKey}.tag`, defaultTag) : undefined;
  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = defaultDescription ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription) : undefined;

  return (
    <section className="py-24 md:py-32">
      <Container>
        {tag && (
           <Badge
           variant="outline"
           className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm"
         >
                {tag}
            </Badge>
        )}
        {title && (
            <h2 className="mx-auto mb-12 max-w-3xl text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {title}
            </h2>
        )}
         {description && (
          <p className="mx-auto mb-16 max-w-3xl text-center text-lg leading-8 text-gray-600 dark:text-gray-300">
            {description}
          </p>
        )}
        <div className={cn(
          "grid grid-cols-1 gap-x-8 gap-y-12",
          items.length === 2 ? "md:grid-cols-2" : "",
          items.length === 3 ? "md:grid-cols-3" : "",
          items.length >= 4 ? "md:grid-cols-4" : ""
        )}>
          {items.map((item, index) => {
            const itemTag = item.tag ? getTranslation(t, `${i18nBaseKey}.items.${index}.tag`, item.tag) : undefined;
            const itemTitle = getTranslation(t, `${i18nBaseKey}.items.${index}.title`, item.title);
            const itemDescription = getTranslation(t, `${i18nBaseKey}.items.${index}.description`, item.description);
            const itemImageAlt = getTranslation(t, `${i18nBaseKey}.items.${index}.imageAlt`, item.imageAlt || item.title);

            const isInternalLink = item.action?.startsWith('/');
            const baseClassName = "group block";
            const hoverClassName = item.action ? "transition-opacity duration-300 hover:opacity-80" : "";

            if (item.action) {
              if (isInternalLink) {
                return (
                  <Link
                    key={index}
                    href={item.action}
                    className={cn(baseClassName, hoverClassName)}
                    aria-label={itemTitle}
                  >
                    <div className="relative mb-6 aspect-[1.5] w-full overflow-hidden rounded-2xl">
                      <Image
                        src={item.imageSrc}
                        alt={itemImageAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    {itemTag && (
                      <Badge variant="outline" className="mb-2">{itemTag}</Badge>
                    )}
                    <h3 className="mb-2 text-xl font-semibold dark:text-white">
                      {itemTitle}
                    </h3>
                    <p className="text-base text-muted-foreground">
                       {itemDescription}
                     </p>
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
                    <div className="relative mb-6 aspect-[1.5] w-full overflow-hidden rounded-2xl">
                      <Image
                        src={item.imageSrc}
                        alt={itemImageAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    {itemTag && (
                      <Badge variant="outline" className="mb-2">{itemTag}</Badge>
                    )}
                    <h3 className="mb-2 text-xl font-semibold dark:text-white">
                      {itemTitle}
                    </h3>
                    <p className="text-base text-muted-foreground">
                       {itemDescription}
                     </p>
                  </a>
                );
              }
            } else {
              return (
                <div key={index} className={baseClassName}>
                  <div className="relative mb-6 aspect-[1.5] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={item.imageSrc}
                      alt={itemImageAlt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {itemTag && (
                    <Badge variant="outline" className="mb-2">{itemTag}</Badge>
                  )}
                  <h3 className="mb-2 text-xl font-semibold dark:text-white">
                    {itemTitle}
                  </h3>
                  <p className="text-base text-muted-foreground">
                     {itemDescription}
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