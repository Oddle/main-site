"use client"; // Add the client directive for interactivity

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqsData from "@/data/faqs.json"; // Import the JSON data
import Container from "@/components/common/Container"; // Import Container

// Define the structure for a single FAQ item
interface FaqItem {
  question: string;
  answer: string;
}

// Define the structure for the props
interface FaqSectionProps {
  pageUrl: string; // Change type from keyof typeof faqsData to string
  locale: string; // Assuming locale is a string like 'en'
}

// Define the structure of the imported JSON data
interface FaqsData {
  [pageUrl: string]: {
    [locale: string]: FaqItem[];
  };
}

export default function FaqSection({ pageUrl, locale }: FaqSectionProps) {
  // Log received props
  console.log("[FaqSection] Received props:", { pageUrl, locale });

  // Cast the imported data to the defined structure
  const typedFaqsData = faqsData as FaqsData;

  // Attempt to get FAQs for the specific page and locale
  let pageFaqs = typedFaqsData[pageUrl]?.[locale];
  console.log(`[FaqSection] Looked up FAQs for locale '${locale}':`, pageFaqs);

  // Fallback to 'en' if initial lookup failed and locale is not 'en'
  if ((!pageFaqs || pageFaqs.length === 0) && locale !== 'en') {
    console.log(`[FaqSection] FAQs for locale '${locale}' not found or empty. Attempting fallback to 'en'.`);
    pageFaqs = typedFaqsData[pageUrl]?.['en'];
    console.log("[FaqSection] Looked up fallback 'en' FAQs:", pageFaqs);
  }

  // Handle cases where data might still not be found (even after fallback)
  if (!pageFaqs || pageFaqs.length === 0) {
    console.log("[FaqSection] No suitable FAQs found (including fallback), returning null.");
    return null; // Or render a fallback UI
  }

  return (
    <>
      <div className="py-24 lg:py-32">
        <Container>
          {/* Title */}
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
              Your questions, answered
            </h2>
            <p className="mt-1 text-muted-foreground">
              Answers to the most frequently asked questions.
            </p>
          </div>
          {/* End Title */}

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {pageFaqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={faq.question}> 
                  <AccordionTrigger className="text-lg font-semibold text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </div>
    </>
  );
} 