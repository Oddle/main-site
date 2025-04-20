import { useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json';

// Assuming pageSectionsData is correctly typed or assert type
const sectionsData = pageSectionsData['demo'];

export default function DemoPage() {
  const locale = useLocale();
  // Enable static rendering
  setRequestLocale(locale);

  // Pass sectionsData specific to this page and the necessary context
  return <DynamicSectionPage sectionsData={sectionsData} locale={locale} pageUrl="/demo" />;
} 