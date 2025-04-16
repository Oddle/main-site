"use client";

import React, { useState } from "react";
import { ArrowRight, LucideIcon, icons } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { Badge } from "@/components/ui/badge";
import Container from "@/components/common/Container";
import { getTranslation } from "@/lib/i18nUtils";
import { BorderBeam } from "@/components/magicui/border-beam";

interface BentoGridItem {
  id: number | string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  linkAction: string;
  span?: 1 | 2 | 3; // Explicitly allow 1, 2, or 3 for span
}

interface FeatureSectionBentoGridProps {
  i18nBaseKey: string;
  badgeText?: string;
  badgeIcon?: string;
  sectionTitle: string;
  sectionDescription?: string;
  items: BentoGridItem[];
}

export default function FeatureSectionBentoGrid({
  i18nBaseKey,
  badgeText: defaultBadgeText,
  badgeIcon,
  sectionTitle: defaultSectionTitle,
  sectionDescription: defaultSectionDescription,
  items = [],
}: FeatureSectionBentoGridProps) {
  const t = useTranslations();
  const [hoveredCardId, setHoveredCardId] = useState<string | number | null>(null);

  const badgeText = defaultBadgeText ? getTranslation(t, `${i18nBaseKey}.badgeText`, defaultBadgeText) : undefined;
  const sectionTitle = getTranslation(t, `${i18nBaseKey}.sectionTitle`, defaultSectionTitle);
  const sectionDescription = defaultSectionDescription ? getTranslation(t, `${i18nBaseKey}.sectionDescription`, defaultSectionDescription) : undefined;

  const renderIcon = (iconName: string | undefined, defaultIcon?: LucideIcon): React.ReactNode => {
    if (!iconName && !defaultIcon) return null;
    const IconComponent = iconName ? icons[iconName as keyof typeof icons] : defaultIcon;
    if (!IconComponent) {
      console.warn(`Icon "${iconName}" not found in lucide-react`);
      return null; // Or return a default icon
    }
    return <IconComponent className="mr-1 h-auto w-4" />;
  };

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="mx-auto flex max-w-screen-md flex-col items-center gap-4 text-center">
          {badgeText && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-2.5 py-1.5 text-sm"
            >
              {renderIcon(badgeIcon)}
              {badgeText}
            </Badge>
          )}
          <h2 className="text-3xl font-semibold lg:text-4xl">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-muted-foreground lg:text-lg">
              {sectionDescription}
            </p>
          )}
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {items.map((item, index) => {
            const itemTitle = getTranslation(t, `${i18nBaseKey}.items.${index}.title`, item.title);
            const itemDescription = getTranslation(t, `${i18nBaseKey}.items.${index}.description`, item.description);
            const itemImageAlt = getTranslation(t, `${i18nBaseKey}.items.${index}.imageAlt`, item.imageAlt);

            return (
              <Link
                href={item.linkAction}
                key={item.id}
                className={clsx(
                  "flex flex-col rounded-lg border transition-shadow hover:shadow-md",
                  item.span === 3 && "lg:col-span-3",
                  item.span === 2 && "lg:col-span-2"
                )}
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div className="relative flex flex-col h-full overflow-hidden rounded-lg">
                  <div className="flex justify-between p-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-medium md:text-lg">
                        {itemTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        {itemDescription}
                      </p>
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border transition-transform group-hover:rotate-[-45deg]">
                      <ArrowRight className="h-auto w-4" />
                    </span>
                  </div>
                  <div className="m-3 p-0 h-72 overflow-hidden">
                    <Image
                      src={item.imageSrc}
                      alt={itemImageAlt}
                      width={800}
                      height={600}
                      className="w-full h-full rounded-lg object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  {hoveredCardId === item.id && (
                    <BorderBeam
                      size={250}
                      duration={1}
                      delay={0}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
} 