"use client";

import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';

import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';

// Define interface for tab data for better type safety
interface TabItem {
  id: number;
  tab?: string;
  title: string;
  description: string;
  benefits?: string[];
  image?: string;
  link?: string;
}

// Remove hardcoded data
// const tabs: TabItem[] = [...];

// Define props interface
interface FeatureSectionWithTabsProps {
  i18nBaseKey?: string;
  title: string;
  description?: string | null;
  items: TabItem[];
  autoRotate?: boolean;
}

const FeatureSectionWithTabs = ({ 
  i18nBaseKey,
  title: defaultTitle,
  description: defaultDescription,
  items = [],
  autoRotate = false
}: FeatureSectionWithTabsProps) => {
  const t = useTranslations();

  // Translate section header
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;
  const description = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription ?? '') : defaultDescription;

  const defaultTabValue = items.length > 0 ? items[0].id.toString() : '1';
  const [activeTab, setActiveTab] = useState(defaultTabValue);
  const intervalDelay = 5000;

  const activeIndex = items.findIndex(tab => tab.id.toString() === activeTab);

  const changeTab = useCallback((newTabId: string) => {
    setActiveTab(newTabId);
  }, []);

  useEffect(() => {
    if (!autoRotate || items.length <= 1) {
      return;
    }
    const intervalId = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      changeTab(items[nextIndex].id.toString());
    }, intervalDelay);
    return () => clearInterval(intervalId);
  }, [items, intervalDelay, activeIndex, autoRotate, changeTab]);

  if (!items || items.length === 0) {
    return null; 
  }

  const activeTabData = items.find(tab => tab.id.toString() === activeTab);

  return (
    <section className="container mx-auto space-y-8 px-4 py-24 md:px-6 2xl:max-w-[1400px]">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {title}
          </h2>
        {description && (
          <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {description}
          </p>
        )}
        </div>

      {/* Tabs for desktop screens */}
      <div className="hidden justify-center gap-4 overflow-x-auto py-2 md:flex">
        {items.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={cn(
              "gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              activeTab === tab.id.toString() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground/80",
              "cursor-pointer"
                    )}
            onClick={() => changeTab(tab.id.toString())}
                  >
            {tab.tab || (i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${index}.title`, tab.title) : tab.title)}
                  </button>
        ))}
            </div>

      {/* Dropdown for mobile screens */}
      <div className="mb-4 flex w-full justify-center md:hidden">
        <select
          className="w-[180px] rounded-md border px-3 py-2 text-sm"
          value={activeTab}
          onChange={e => changeTab(e.target.value)}
        >
          {items.map((tab, index) => (
            <option key={tab.id} value={tab.id}>
              {tab.tab || (i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${index}.title`, tab.title) : tab.title)}
            </option>
          ))}
        </select>
          </div>

      {/* Card Content for Active Tab */}
              {activeTabData && (
        <div className="overflow-hidden rounded-xl border bg-background shadow">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6 p-6 lg:p-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${items.findIndex(tab => tab.id.toString() === activeTab)}.title`, activeTabData.title) : activeTabData.title}
                </h3>
                <p className="text-muted-foreground">
                  {i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${items.findIndex(tab => tab.id.toString() === activeTab)}.description`, activeTabData.description) : activeTabData.description}
                </p>
              </div>
              {activeTabData.benefits && (
                <ul className="grid gap-3">
                  {activeTabData.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="bg-primary size-2 rounded-full" />
                      {i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${items.findIndex(tab => tab.id.toString() === activeTab)}.benefits.${idx}`, benefit) : benefit}
                    </li>
                  ))}
                </ul>
              )}
                      </div>
            <div className="relative aspect-video lg:aspect-auto">
              {activeTabData.image && (
                        <Image
                          src={activeTabData.image}
                  alt={i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${items.findIndex(tab => tab.id.toString() === activeTab)}.title`, activeTabData.title) : activeTabData.title}
                          fill
                          className="object-cover"
                  priority
                        />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeatureSectionWithTabs; 