import type { Metadata } from 'next'; // Import Metadata type
import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json'; // Import data from central JSON
// Import the metadata helper
import { generatePageMetadata } from '@/lib/metadataUtils';

// Define Section type for clarity
interface Section {
  component: string;
  props: Record<string, unknown>;
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
const homeSections: Section[] = (pageSectionsData as { home?: Section[] })?.home || []; 

// Re-add await for params
export default async function HomePage({ params }: MetadataProps) { 
  const resolvedParams = await params; // Await params here
  const locale = resolvedParams.locale; // Get locale from resolved params

  setRequestLocale(locale);

  // Pass the extracted home sections
  return <DynamicSectionPage sectionsData={homeSections} locale={locale} pageUrl="/" />;
}
