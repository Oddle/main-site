"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from 'next/image';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from '@/components/common/Container';
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';

// Interface for individual accordion items
interface StandardItemData {
  id: number;
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
}

// Interface for the component props
interface FeatureSectionWithAccordionProps {
  i18nBaseKey?: string;
  tag?: string | null;
  title: string;
  description?: string | null;
  items: StandardItemData[];
}

const FeatureSectionWithAccordion = ({ 
  i18nBaseKey,
  tag: defaultTag,
  title: defaultTitle,
  description: defaultDescription,
  items = []
}: FeatureSectionWithAccordionProps) => {
  const t = useTranslations();
  
  const defaultItemId = items.length > 0 ? items[0].id : 0;
  const defaultItemData = items.find(item => item.id === defaultItemId);
  const defaultImageSrc = defaultItemData?.imageSrc ?? '';
  const defaultImageAltText = defaultItemData 
    ? (i18nBaseKey 
        ? getTranslation(t, `${i18nBaseKey}.items.${items.findIndex(i => i.id === defaultItemId)}.imageAlt`, defaultItemData.imageAlt)
        : defaultItemData.imageAlt)
    : 'Feature illustration';

  const [activeItemId, setActiveItemId] = useState<number>(defaultItemId);
  const [activeImage, setActiveImage] = useState<string>(defaultImageSrc);
  const [activeImageAlt, setActiveImageAlt] = useState<string>(defaultImageAltText);
  const [progressBarHeight, setProgressBarHeight] = useState<number>(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const AUTO_SWITCH_INTERVAL = 5000;
  const PROGRESS_UPDATE_INTERVAL = 50;

  const tag = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.tag`, defaultTag ?? '') : defaultTag;
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;
  const description = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription ?? '') : defaultDescription;

  if (!items || items.length === 0) {
    return null; 
  }

  const startAutoSwitch = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgressBarHeight(0);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setActiveItemId((prevId) => {
        const currentIndex = items.findIndex((item) => item.id === prevId);
        if (currentIndex === -1 && items.length > 0) return items[0].id;
        if (currentIndex === -1) return 0;
        const nextIndex = (currentIndex + 1) % items.length;
        const nextItem = items[nextIndex];
        if (nextItem) {
           setActiveImage(nextItem.imageSrc);
           const nextItemBaseKey = `${i18nBaseKey}.items.${nextIndex}`;
           const nextImageAlt = i18nBaseKey 
             ? getTranslation(t, `${nextItemBaseKey}.imageAlt`, nextItem.imageAlt)
             : nextItem.imageAlt;
           setActiveImageAlt(nextImageAlt);

           setProgressBarHeight(0);
           startTimeRef.current = Date.now();
           return nextItem.id;
        }
        return prevId; 
      });
    }, AUTO_SWITCH_INTERVAL);

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / AUTO_SWITCH_INTERVAL) * 100);
      setProgressBarHeight(progress);
    }, PROGRESS_UPDATE_INTERVAL);
  }, [items, i18nBaseKey, getTranslation, t]);

  useEffect(() => {
    if (items.length > 1) {
      startAutoSwitch();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleValueChange = (value: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgressBarHeight(0);

    if (!value) { 
      return; 
    } 

    const id = parseInt(value.split("-")[1]);
    const activeItemIndex = items.findIndex((item) => item.id === id);
    const activeItem = items[activeItemIndex];
    
    if (activeItem) {
      setActiveItemId(id);
      setActiveImage(activeItem.imageSrc);
      const activeItemBaseKey = `${i18nBaseKey}.items.${activeItemIndex}`;
      const newImageAlt = i18nBaseKey 
        ? getTranslation(t, `${activeItemBaseKey}.imageAlt`, activeItem.imageAlt)
        : activeItem.imageAlt;
      setActiveImageAlt(newImageAlt);

      if (items.length > 1) {
        startAutoSwitch();
      }
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="mb-12 text-center md:mb-16 lg:mb-20 max-w-3xl mx-auto">
           {tag && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary md:mb-3 lg:text-base">
                 {tag}
              </p>
           )}
           <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:mb-6 md:text-4xl">
              {title}
           </h2>
           {description && (
              <p className="text-lg text-muted-foreground">
                 {description}
              </p>
           )}
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row md:items-start lg:gap-16">
          <div className="w-full md:w-5/12 lg:max-w-[500px]">
            <Accordion
              type="single"
              value={`item-${activeItemId}`}
              collapsible
              className="w-full"
              onValueChange={handleValueChange}
            >
              {items.map((item, index) => {
                 const itemBaseKey = `${i18nBaseKey}.items.${index}`;
                 const itemTitle = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.title`, item.title) : item.title;
                 const itemDescription = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.description`, item.description) : item.description;
                 const itemImageAlt = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.imageAlt`, item.imageAlt) : item.imageAlt;

                 return (
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
                          {itemTitle}
                        </h6>
                      </AccordionTrigger>
                      <AccordionContent className="overflow-hidden pl-4">
                        <p className="mt-1 pb-4 leading-relaxed text-muted-foreground">
                          {itemDescription}
                        </p>
                        <div className="relative mt-4 h-64 w-full md:hidden">
                          <Image
                            src={item.imageSrc}
                            alt={itemImageAlt}
                            fill
                            className="rounded-md object-cover transition-transform duration-300"
                            sizes="(max-width: 768px) 90vw, 0vw"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                 );
              })}
            </Accordion>
          </div>

          <div className="relative hidden w-full overflow-hidden rounded-md bg-accent/30 pt-12 pl-12 md:block md:w-7/12 lg:min-h-[550px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <Image
              src={activeImage}
              alt={activeImageAlt}
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