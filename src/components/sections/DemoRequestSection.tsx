"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check } from "lucide-react";

import Container from '@/components/common/Container';
import InlineCustomerLogos from '@/components/common/InlineCustomerLogos';
import DemoRequestForm from '@/components/forms/DemoRequestForm'; // Import the form component
import { getTranslation } from '@/lib/i18nUtils';

interface DemoRequestSectionProps {
  i18nBaseKey: string; // e.g., "demoPage.section"
  locale: string;
}

export default function DemoRequestSection({ i18nBaseKey, locale }: DemoRequestSectionProps) {
  const t = useTranslations(i18nBaseKey);

  const title = getTranslation(t, 'title', 'See the Platform in Action');
  const description = getTranslation(t, 'description', 'Get a personalized demo tailored to your restaurant needs.');
  const expectTitle = getTranslation(t, 'expectTitle', 'What you can expect:');
  const expectItems = t.raw('expectItems') as string[] || [
    'Detailed product presentation tailored to you',
    'Consulting on your specific challenges',
    'Answers to all the questions you have',
  ];

  return (
    <section className="relative py-24 lg:py-32">
      {/* Optional: Add background effects from the example if desired */}
      {/* <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 ..."></div> */}

      <Container>
        <div className="grid w-full grid-cols-1 gap-y-16 gap-x-16 lg:grid-cols-2 lg:items-start xl:gap-x-24">
          {/* Left Column */}
          <div className="w-full space-y-10 lg:space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-medium lg:text-5xl">
                {title}
              </h1>
              <p className="text-muted-foreground md:text-base lg:text-lg lg:leading-7">
                {description}
              </p>
            </div>

            {/* "What to Expect" Section */}
            <div className="space-y-6">
              <p className="text-base font-semibold">{expectTitle}</p>
              <div className="space-y-4">
                {expectItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2.5">
                    <Check className="size-5 shrink-0 text-muted-foreground" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Logos Section */}
            {/* Pass the correct i18n key for the 'Trusted By' title */}
            <InlineCustomerLogos locale={locale} i18nBaseKey="common.trustedBy" />

          </div>

          {/* Right Column (Form) */}
          <div className="flex w-full justify-center lg:justify-start">
            {/* Pass the fixed, common translation key for the form */}
            <DemoRequestForm i18nBaseKey="common.forms.demoRequest" />
          </div>
        </div>
      </Container>
    </section>
  );
} 