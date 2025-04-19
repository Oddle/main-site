"use client";

import { useState, useEffect, useRef } from "react";
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
  
  // --- Moved Hooks to the top --- 
  const defaultItemId = itemsData.length > 0 ? itemsData[0].id : 0; // Handle empty array for default ID
  const defaultItemValue = `item-${defaultItemId}`;
  const defaultImageSrc = itemsData.length > 0 ? itemsData[0].imageSrc : ''; // Handle empty array

  const [activeItemId, setActiveItemId] = useState<number>(defaultItemId);
  const [activeImage, setActiveImage] = useState<string>(defaultImageSrc);
  const [progressBarHeight, setProgressBarHeight] = useState<number>(0); // State for progress bar
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store interval ID
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for progress bar timer
  const startTimeRef = useRef<number>(Date.now()); // Ref to store cycle start time

  const AUTO_SWITCH_INTERVAL = 3500; // ms
  const PROGRESS_UPDATE_INTERVAL = 50; // ms - How often to update the bar visual

  // Ensure component doesn't break if itemsData is empty
  if (!itemsData || itemsData.length === 0) {
    // Optionally render nothing or a placeholder if no data
    return null; 
  }

  // --- Auto-Switch & Progress Bar Logic --- 
  const startAutoSwitch = () => {
    // Clear existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgressBarHeight(0); // Reset progress bar
    startTimeRef.current = Date.now(); // Record start time

    // Interval to switch items
    intervalRef.current = setInterval(() => {
      setActiveItemId((prevId) => {
        const currentIndex = itemsData.findIndex((item) => item.id === prevId);
        if (currentIndex === -1 && itemsData.length > 0) return itemsData[0].id;
        if (currentIndex === -1) return 0;

        const nextIndex = (currentIndex + 1) % itemsData.length;
        const nextItem = itemsData[nextIndex];

        if (nextItem) {
           setActiveImage(nextItem.imageSrc);
           // Reset progress bar and start time for the new item's cycle
           setProgressBarHeight(0);
           startTimeRef.current = Date.now();
           return nextItem.id;
        }
        return prevId; 
      });
    }, AUTO_SWITCH_INTERVAL);

    // Interval to update progress bar UI
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / AUTO_SWITCH_INTERVAL) * 100);
      setProgressBarHeight(progress);
    }, PROGRESS_UPDATE_INTERVAL);
  };

  useEffect(() => {
    if (itemsData.length > 1) {
      startAutoSwitch();
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsData]); // Re-run if itemsData itself changes identity


  // --- Modified handleValueChange ---
  const handleValueChange = (value: string) => {
    // Stop current timers and reset progress on manual interaction
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgressBarHeight(0);

    if (!value) { 
      // Accordion collapsed - Timers remain stopped.
      // Set activeItemId to a non-existent ID or 0? Or keep it as is?
      // Let's keep the activeItemId so the corresponding image stays visible.
      return; 
    } 

    const id = parseInt(value.split("-")[1]);
    const activeItem = itemsData.find((item) => item.id === id);
    if (activeItem) {
      setActiveItemId(id);
      setActiveImage(activeItem.imageSrc);
      // Restart the auto-switch cycle after manual selection
      if (itemsData.length > 1) {
        startAutoSwitch();
      }
    }
  };


  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        {/* New Centered Div for Title and Description */}
        <div className="mb-12 text-center md:mb-16 lg:mb-20 max-w-3xl mx-auto">
           <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:mb-6 md:text-4xl">
              {sectionTitle}
           </h2>
           {sectionDescription && (
              <p className="text-lg text-muted-foreground">
                 {sectionDescription}
              </p>
           )}
        </div>

        {/* Existing Flex Container now only for Accordion and Image */}
        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row md:items-start lg:gap-16">
          {/* Accordion Column (Left) */}
          <div className="w-full md:w-5/12 lg:max-w-[500px]">
            <Accordion
              type="single"
              value={`item-${activeItemId}`}
              collapsible
              className="w-full"
              onValueChange={handleValueChange}
            >
              {itemsData.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={`item-${item.id}`}
                  className={cn(
                    "relative overflow-hidden border-t border-b-0 px-2 transition-all duration-300 first:border-t-0",
                    item.id === activeItemId
                      ? "border-primary/50 bg-accent/40"
                      : "border-muted hover:bg-accent/20"
                  )}
                >
                  {/* Progress Bar - Render only for active item */}
                  {item.id === activeItemId && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary transition-all duration-100 ease-linear"
                      style={{ height: `${progressBarHeight}%` }}
                    ></div>
                  )}
                  <AccordionTrigger className="pl-4 cursor-pointer py-5 text-left !no-underline transition-all hover:no-underline">
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
                  <AccordionContent className="overflow-hidden pl-4">
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

          {/* Image Column (Right) */}
          <div className="relative hidden w-full overflow-hidden rounded-md bg-accent/30 pt-12 pl-12 md:block md:w-7/12 lg:min-h-[550px]">
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