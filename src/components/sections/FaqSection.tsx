"use client"; // Add the client directive for interactivity

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale, useTranslations } from "next-intl"; // Correct import path for useLocale and useTranslations
import faqsData from "@/data/faqs.json"; // Import the JSON data
import Container from "@/components/common/Container"; // Import Container
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper

// Define the structure for a single FAQ item
interface FaqItem {
  question: string;
  answer: string;
  category?: string; // Keep optional category if needed within items
}

// Define the structure for the FAQs data based on the error message
interface FaqsData {
  [pageOrCategoryUrl: string]: { // Keys are page URLs or potentially categories
    [locale: string]: FaqItem[]; // e.g., 'en', 'zh'
  };
}

interface FaqSectionProps {
  pageUrl?: string; // URL of the page the FAQ section belongs to
  faqCategory?: string; // Optional category to filter further or use as primary key
}

const FaqSection = ({ pageUrl, faqCategory }: FaqSectionProps) => {
  const locale = useLocale();
  const t = useTranslations(); // Initialize translations

  // Cast the imported data to the corrected structure
  const allFaqsData = faqsData as FaqsData;

  // Determine the key to use for lookup (category takes precedence if provided)
  const lookupKey = faqCategory ?? pageUrl;

  if (!lookupKey) {
      console.error("[FaqSection] Requires either pageUrl or faqCategory prop.");
      return null; // Need a key to lookup FAQs
  }

  // Get FAQs for the specific lookup key and locale
  let pageFaqs = allFaqsData[lookupKey]?.[locale];
  // console.log(`[FaqSection] Looked up FAQs for key '${lookupKey}', locale '${locale}':`, pageFaqs);

  // Fallback logic if no FAQs found
  if ((!pageFaqs || pageFaqs.length === 0) && locale !== 'en') {
    // console.log(`[FaqSection] FAQs for key '${lookupKey}', locale '${locale}' not found/empty. Falling back to 'en'.`);
    pageFaqs = allFaqsData[lookupKey]?.['en'];
    // console.log("[FaqSection] Looked up fallback 'en' FAQs:", pageFaqs);
  }

  // If still no FAQs found, return null
  if (!pageFaqs || pageFaqs.length === 0) {
    // console.log(`[FaqSection] No suitable FAQs found for key '${lookupKey}' (including fallback), returning null.`);
    return null;
  }

  // Define default title and base key
  const defaultSectionTitle = "Frequently Asked Questions";
  // const sectionBaseKey = "faq"; // No longer needed for title

  // Translate section title using common key
  const sectionTitle = getTranslation(t, 'common.faqTitle', defaultSectionTitle); // Use common.faqTitle

  // Render the FAQs using the Accordion component
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
      <Container className="max-w-3xl">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
            {sectionTitle}
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {pageFaqs.map((faq, index) => {
            // Remove translation logic for individual items
            // const faqKey = `${faqCategory || 'general'}.${index}`; 
            // const faqTitle = getTranslation(t, `faq.${faqKey}.title`, faq.question);
            // const faqDescription = getTranslation(t, `faq.${faqKey}.description`, faq.answer);

            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left">
                  {faq.question} {/* Render question directly */}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer} {/* Render answer directly */}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Container>
    </section>
  );
}

export default FaqSection; 