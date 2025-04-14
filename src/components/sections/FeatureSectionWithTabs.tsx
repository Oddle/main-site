"use client";

import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import Container from '@/components/common/Container';
import { cn } from "@/lib/utils";

// Define interface for tab data for better type safety
interface TabItem {
  id: number;
  tabName: string;
  tabDescription: string;
  link: string;
  image: string;
}

// Remove hardcoded data
// const tabs: TabItem[] = [...];

// Define props interface
interface FeatureSectionWithTabsProps {
  sectionTitle: string;
  subtitle: string;
  tabsData: TabItem[];
  autoRotate?: boolean;
}

// Animation variants for sliding
const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    };
  }
};

const FeatureSectionWithTabs = ({ 
  sectionTitle,
  subtitle,
  tabsData = [],
  autoRotate = false
}: FeatureSectionWithTabsProps) => {
  const defaultTabValue = tabsData.length > 0 ? tabsData[0].id.toString() : '1';
  const [[activeTab, direction], setActiveTabState] = useState([defaultTabValue, 0]);
  const intervalDelay = 5000;

  const activeIndex = tabsData.findIndex(tab => tab.id.toString() === activeTab);

  const changeTab = useCallback((newTabId: string) => {
    setActiveTabState(prevState => {
      const prevActiveTabId = prevState[0];
      const currentActiveIndex = tabsData.findIndex(tab => tab.id.toString() === prevActiveTabId);
      const newIndex = tabsData.findIndex(tab => tab.id.toString() === newTabId);
      const currentDirection = newIndex > currentActiveIndex ? 1 : -1;
      return [newTabId, currentDirection];
    });
  }, [tabsData]);

  useEffect(() => {
    if (!autoRotate || tabsData.length <= 1) {
      return;
    }
    const intervalId = setInterval(() => {
      const nextIndex = (activeIndex + 1) % tabsData.length;
      changeTab(tabsData[nextIndex].id.toString());
    }, intervalDelay);
    return () => clearInterval(intervalId);
  }, [tabsData, intervalDelay, activeIndex, autoRotate, changeTab]);

  if (!tabsData || tabsData.length === 0) {
    return null; 
  }

  const activeTabData = tabsData.find(tab => tab.id.toString() === activeTab);

  return (
    <section className="py-24 md:py-32">
      <Container>
        {/* Title and Subtitle Section */} 
        <div className="mx-auto mb-12 flex max-w-screen-md flex-col items-center gap-4 text-center lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            {sectionTitle}
          </h2>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        {/* Tabs Section */} 
        <div className="mt-12">
          {/* Added outer flex container for centering */} 
          <div className="flex justify-center mb-8">
            {/* Changed to inline-flex, removed justify-center (handled by parent now) */}
            <div className="relative inline-flex h-auto flex-wrap rounded-full bg-muted p-1 dark:bg-slate-800">
              {tabsData.map((tab) => {
                const isActive = activeTab === tab.id.toString();
                return (
                  <button
                    key={tab.id}
                    onClick={() => changeTab(tab.id.toString())}
                    className={cn(
                      "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                    )}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-indicator"
                        className="absolute inset-0 z-0 rounded-full bg-background shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{tab.tabName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area with Animation */}
          <div className="relative h-[550px] w-full overflow-hidden md:h-[650px]">
            <AnimatePresence initial={false} custom={direction}>
              {activeTabData && (
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute top-0 left-0 right-0"
                >
                  <div className="w-full overflow-hidden rounded-lg bg-background px-6 py-6 dark:bg-slate-900 md:px-10 md:py-8">
                    <div className="flex flex-col justify-between">
                      <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center md:flex-row md:text-left">
                        <p className="text-base text-muted-foreground">{activeTabData.tabDescription}</p>
                        <Link
                          href={activeTabData.link}
                          className="font-sm whitespace-nowrap border-b border-primary text-sm font-medium text-primary transition-colors hover:border-primary/70 hover:text-primary/70"
                        >
                          Learn more
                        </Link>
                      </div>
                      <div className="relative mx-auto h-72 w-full max-w-4xl overflow-hidden rounded-md bg-muted shadow-lg dark:bg-slate-800 md:h-[420px]">
                        <Image
                          src={activeTabData.image}
                          alt={activeTabData.tabName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 70vw, 60vw"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeatureSectionWithTabs; 