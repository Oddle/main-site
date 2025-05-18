import { useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadataUtils';

// Generate metadata for the main Demo page (demo/page.tsx)
export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await paramsPromise;
  return generatePageMetadata({ locale: params.locale, pageKey: 'demo' });
}

// Assuming pageSectionsData is correctly typed or assert type
const sectionsData = pageSectionsData['demo'];

export default function DemoPage() {
  const locale = useLocale();
  // Enable static rendering
  setRequestLocale(locale);

  // Pass sectionsData specific to this page and the necessary context
  return <DynamicSectionPage sectionsData={sectionsData} locale={locale} pageUrl="/demo" />;
} 