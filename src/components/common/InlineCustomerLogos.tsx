"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';
import customerLogosData from '@/data/customerLogos.json'; // Import the logo data

interface CustomerLogo {
  name: string;
  src: string;
  alt: string;
}

interface InlineCustomerLogosProps {
  locale: string;
  i18nBaseKey: string; // e.g., "common.trustedBy"
  titleDefault?: string; // Default title if no i18n key
}

// Define a type for the structure of the imported JSON data
type LocaleLogosData = {
  [key: string]: CustomerLogo[];
};

export default function InlineCustomerLogos({
  locale,
  i18nBaseKey,
  titleDefault = "Trusted by", // Default title text
}: InlineCustomerLogosProps) {
  const t = useTranslations();

  // Attempt to get translated title
  const sectionTitle = getTranslation(t, `${i18nBaseKey}.title`, titleDefault);

  // Type the imported data
  const allLogosData: LocaleLogosData = customerLogosData;

  // Get logos for the current locale, fallback to 'en'
  const logos = allLogosData[locale] && allLogosData[locale].length > 0
                ? allLogosData[locale]
                : allLogosData['en'] || [];

  // If no logos are found, render nothing for this inline component
  if (!logos || logos.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 lg:mt-12">
      <span className="text-xs font-medium uppercase text-muted-foreground">
        {sectionTitle}
      </span>
      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
        {logos.map((logo) => (
          <Image
            key={logo.name}
            src={logo.src}
            alt={logo.alt}
            width={150} // Increased width hint
            height={50} // Increased height hint
            className="h-10 sm:h-12 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" // Increased height classes
          />
        ))}
      </div>
    </div>
  );
} 