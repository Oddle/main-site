"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import Container from "@/components/common/Container";
import { getTranslation } from '@/lib/i18nUtils';

interface CallToActionSectionProps {
  i18nBaseKey: string; // e.g., "common.cta.standard"
  imageSrc?: string;
  imageAlt?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
  // Default values for props if not provided via i18n
  tagDefault?: string;
  titleDefault?: string;
  descriptionDefault?: string;
  primaryButtonTextDefault?: string;
  secondaryButtonTextDefault?: string;
  imageAltDefault?: string;
}

export default function CallToActionSection({
  i18nBaseKey,
  imageSrc = "https://shadcnblocks.com/images/block/photos/pawel-czerwinski-O4fAgtXLRwI-unsplash.jpg", // Default image
  imageAlt: imageAltProp,
  primaryButtonLink = "/demo", // Default link
  secondaryButtonLink = "/pricing", // Default link
  tagDefault = "Ready to get started?",
  titleDefault = "Start your free trial today.",
  descriptionDefault = "Start with a 14-day free trial. No credit card required. Cancel anytime.",
  primaryButtonTextDefault = "Get Started",
  secondaryButtonTextDefault = "Learn More",
  imageAltDefault = "Abstract background image",
}: CallToActionSectionProps) {
  const t = useTranslations(i18nBaseKey);
  const tCommonButtons = useTranslations('common.buttons'); // Use common buttons if specific aren't found

  const tag = getTranslation(t, 'tag', tagDefault);
  const title = getTranslation(t, 'title', titleDefault);
  const description = getTranslation(t, 'description', descriptionDefault);
  const primaryButtonText = getTranslation(t, 'primaryButtonText', tCommonButtons('requestDemo') || primaryButtonTextDefault);
  const secondaryButtonText = getTranslation(t, 'secondaryButtonText', tCommonButtons('learnMore') || secondaryButtonTextDefault);
  const imageAlt = getTranslation(t, 'imageAlt', imageAltProp || imageAltDefault);

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Using max-w-screen-xl like example, adjust if needed */}
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-12 overflow-hidden rounded-2xl border bg-background lg:flex-row">
          {/* Content */}
          <div className="flex flex-col justify-center p-8 text-center sm:p-12 lg:w-1/2 lg:py-24 lg:text-left xl:p-16">
            {tag && (
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {tag}
              </p>
            )}
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" asChild>
                <Link href={primaryButtonLink}>{primaryButtonText}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            </div>
          </div>

          {/* Image (conditionally rendered) */}
          {imageSrc && (
            <div className="relative h-64 w-full lg:h-auto lg:w-1/2">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
} 