"use client";

import { useState } from "react";
import Image from 'next/image';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from '@/components/common/Container';
import { cn } from "@/lib/utils";

// Interface for individual accordion items
interface AccordionItemData {
  id: number;
  title: string;
  imageSrc: string;
  description: string;
}

// Interface for the component props
interface FeatureSectionWithAccordionProps {
  sectionTitle: string;
  sectionDescription?: string | null;
  itemsData: AccordionItemData[];
}

const FeatureSectionWithAccordion = ({ 
  sectionTitle,
  sectionDescription,
  itemsData = []
}: FeatureSectionWithAccordionProps) => {
  
  // Ensure component doesn't break if itemsData is empty
  if (!itemsData || itemsData.length === 0) {
    // Optionally render nothing or a placeholder if no data
    return null; 
  }

  const defaultItemId = itemsData[0].id;
  const defaultItemValue = `item-${defaultItemId}`;
  const [activeItemId, setActiveItemId] = useState<number>(defaultItemId);
  const [activeImage, setActiveImage] = useState<string>(itemsData[0].imageSrc);

  const handleValueChange = (value: string) => {
    if (!value) return; // Accordion can be fully collapsed, value might be empty
    const id = parseInt(value.split("-")[1]);
    const activeItem = itemsData.find((item) => item.id === id);
    if (activeItem) {
      setActiveItemId(id);
      setActiveImage(activeItem.imageSrc);
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row lg:gap-16">
          {/* Left Column (now visually Right): Title, Description, Accordion */}
          <div className="w-full md:max-w-[400px] lg:max-w-[500px]">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:mb-6 md:text-4xl">
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className="mb-8 text-lg text-muted-foreground md:mb-12">
                {sectionDescription}
              </p>
            )}
            <Accordion
              type="single"
              defaultValue={defaultItemValue}
              collapsible
              className="w-full"
              onValueChange={handleValueChange}
            >
              {itemsData.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={`item-${item.id}`}
                  className={cn(
                    "border-t border-b-0 px-2 transition-all duration-300 first:border-t-0",
                    item.id === activeItemId
                      ? "border-primary/50 bg-accent/40"
                      : "border-muted hover:bg-accent/20"
                  )}
                >
                  <AccordionTrigger className="cursor-pointer py-5 text-left !no-underline transition-all hover:no-underline">
                    <h6
                      className={cn(
                        "text-lg font-medium transition-colors duration-300 md:text-xl",
                        item.id === activeItemId
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      {item.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent className="overflow-hidden">
                    <p className="mt-1 pb-4 leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="relative mt-4 h-64 w-full md:hidden">
                      <Image
                        src={item.imageSrc}
                        alt={item.title}
                        fill
                        className="rounded-md object-cover transition-transform duration-300"
                        sizes="(max-width: 768px) 90vw, 0vw"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column (now visually Left): Desktop Image */}
          <div className="relative hidden w-full overflow-hidden rounded-md bg-accent/30 pt-12 pl-12 md:block lg:min-h-[550px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <Image
              src={activeImage}
              alt="Feature illustration"
              fill
              className="object-contain transition-all duration-500 ease-in-out"
              sizes="(min-width: 768px) 50vw, 0vw"
              priority={true}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeatureSectionWithAccordion; 