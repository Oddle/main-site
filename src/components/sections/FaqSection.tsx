"use client"; // Add the client directive for interactivity

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "next-intl"; // Correct import path for useLocale
import faqsData from "@/data/faqs.json"; // Import the JSON data
import Container from "@/components/common/Container"; // Import Container

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
  // console.log("[FaqSection] Received props:", { pageUrl, faqCategory, locale });

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

  // Render the FAQs using the Accordion component
  return (
    <>
      <Container className="max-w-4xl py-12 lg:py-24">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full mt-8">
          {pageFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </>
  );
}

export default FaqSection; 