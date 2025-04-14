import { useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json'; // Import data from central JSON

// Define the type for the sections data if needed, or assert type
// Assuming pageSectionsData has keys corresponding to page routes
const sectionsData = pageSectionsData['home'];

export default function HomePage() {
  const locale = useLocale();
  // Enable static rendering
  setRequestLocale(locale);

  // Pass sectionsData specific to this page
  return <DynamicSectionPage sectionsData={sectionsData} locale={locale} pageUrl="/" />;
}
