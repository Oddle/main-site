"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Container from '@/components/common/Container';
import { getTranslation } from '@/lib/i18nUtils';
import customerLogosData from '@/data/customerLogos.json'; // Import the logo data

interface CustomerLogo {
  name: string;
  src: string;
  alt: string;
}

interface CustomerLogosSectionProps {
  i18nBaseKey?: string; // e.g., "common.trustedBy"
  title?: string; // Default title if no i18n key
  locale: string; // <-- Add locale prop
}

// Define a type for the structure of the imported JSON data
type LocaleLogosData = {
  [key: string]: CustomerLogo[];
};

export default function CustomerLogosSection({
  i18nBaseKey,
  title: defaultTitle = "Trusted by", // Default title text
  locale, // <-- Destructure locale prop
}: CustomerLogosSectionProps) {
  const t = useTranslations();

  // Attempt to get translated title, fallback to defaultTitle
  const sectionTitle = i18nBaseKey
    ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle)
    : defaultTitle;

  // Type the imported data
  const allLogosData: LocaleLogosData = customerLogosData;

  // Get logos for the current locale, fallback to 'en' if not found or empty
  const logos = allLogosData[locale] && allLogosData[locale].length > 0 
                ? allLogosData[locale] 
                : allLogosData['en'] || []; // Fallback to 'en' or empty array

  // If no logos are found even after fallback, optionally hide the section
  if (!logos || logos.length === 0) {
    return null; // Or render a different message
  }

  return (
    <section className="py-12 bg-muted/40">
      <Container>
        <div className="text-center">
          {sectionTitle && (
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">
              {sectionTitle}
            </h2>
          )}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {logos.map((logo) => (
              <div key={logo.name} className="flex justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150} // Adjust width as needed
                  height={50} // Adjust height as needed
                  className="h-8 sm:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
} 