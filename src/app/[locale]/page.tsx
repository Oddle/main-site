import type { Metadata } from 'next'; // Import Metadata type
import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json'; // Import data from central JSON
import { generatePageMetadata } from '@/lib/metadataUtils'; // Import the metadata helper

// Import commonData and its types (assuming similar structure to pricing page)
import commonDataJson from "@/data/common.json";

interface CommonProductDataEntry {
  name: string;
  description: string;
  href: string;
  category: string;
  excludedLocales?: string[];
}

interface CommonData {
  products: {
    [key: string]: CommonProductDataEntry;
  };
  // Add other top-level keys from common.json if needed for typing
}
const commonData: CommonData = commonDataJson as CommonData;

// Define Section type for clarity
interface Section {
  component: string;
  props: Record<string, any>; // Use any for props items for easier manipulation here
}

// --- Generate Metadata using the helper --- 
// Type for params passed to generateMetadata - Expect a Promise
type MetadataProps = {
  params: Promise<{ locale: string }>; // Expect Promise
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  // Await params here
  const resolvedParams = await params;
  const pageKey = 'home'; // Key for the homepage

  return generatePageMetadata({ 
    locale: resolvedParams.locale, // Use resolved locale
    pageKey: pageKey,
  });
}
// ---------------------------------------


// --- Existing Page Component (Marked as async) --- 

// Access the 'home' sections and provide type hint
const rawHomeSections: Section[] = (pageSectionsData as { home?: Section[] })?.home || []; 

// Re-add await for params
export default async function HomePage({ params }: MetadataProps) { 
  const resolvedParams = await params; // Await params here
  const locale = resolvedParams.locale; // Get locale from resolved params

  setRequestLocale(locale);

  // Filter sections before passing to DynamicSectionPage
  const homeSections = rawHomeSections.map(section => {
    if (section.component === 'FeatureSectionBentoGrid' && section.props && section.props.items && Array.isArray(section.props.items)) {
      const originalItems = section.props.items;
      const filteredItems = originalItems.filter(item => {
        if (item.linkAction && typeof item.linkAction === 'string') {
          const pathParts = item.linkAction.split('/');
          const productKey = pathParts.pop(); // Get the last part of the path
          
          if (productKey && commonData.products[productKey]) {
            const commonProduct = commonData.products[productKey];
            if (commonProduct.excludedLocales && commonProduct.excludedLocales.includes(locale)) {
              return false; // Exclude this item
            }
          }
        }
        return true; // Include by default
      });
      return {
        ...section,
        props: {
          ...section.props,
          items: filteredItems
        }
      };
    }
    return section;
  });

  // Pass the modified home sections
  return <DynamicSectionPage sectionsData={homeSections} locale={locale} pageUrl="/" />;
}
