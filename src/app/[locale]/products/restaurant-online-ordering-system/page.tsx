import { useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json'; // Import the data from central JSON

// Select the appropriate section data for this page
// Use a type assertion or define a type if needed
const sectionsData = pageSectionsData['products/restaurant-online-ordering-system'];

export default function RestaurantOnlineOrderingSystemPage() {
  const locale = useLocale();
  // Enable static rendering
  setRequestLocale(locale);

  // Pass sectionsData specific to this page
  return <DynamicSectionPage sectionsData={sectionsData} />;
} 