import type { Metadata } from 'next'; // Import Metadata type
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import DynamicSectionPage from '@/components/pages/DynamicSectionPage'; // Import the central component
import { setRequestLocale } from 'next-intl/server'; // Import for setting locale
import { routing } from '@/i18n/routing'; // Import routing config
import { generatePageMetadata } from '@/lib/metadataUtils'; // Import the new helper function
import type { Viewport } from 'next'; // Import Viewport type

// --- Data Types (Remove unused PageMetadata) ---
// interface PageMetadata { 
//   title?: string;
//   description?: string;
// }

interface Section {
  component: string;
  props: Record<string, unknown>;
}

interface PageData {
  [key: string]: Section[];
}

// --- Metadata Fetching (Helper function used instead) ---
// --- Remove unused function ---
// async function getAllMetadata(): Promise<{ [key: string]: PageMetadata }> {
//   // ... implementation ...
// }

// --- Section Data Fetching (Keep) ---
async function getPageSectionsData(): Promise<PageData> {
  const filePath = path.join(process.cwd(), 'src/data/pageSections.json');
  try {
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading or parsing pageSections.json:", error);
    return {};
  }
}

// --- Generate Static Paths (Keep) ---
export async function generateStaticParams() {
  const data = await getPageSectionsData();
  const productKeys = Object.keys(data).filter(key => key.startsWith('products/'));
  const productSlugs = productKeys.map(key => key.replace('products/', ''));

  const params = routing.locales.flatMap((locale: string) => 
    productSlugs.map(slug => ({
      locale,
      slug,
    }))
  );
  return params;
}

// --- Updated generateMetadata (Uses helper - Keep) ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const pageKey = `products/${resolvedParams.slug}`;
  
  // Call the centralized helper function (this already returns correct Metadata type)
  return generatePageMetadata({ 
    locale: resolvedParams.locale, 
    pageKey: pageKey,
    slug: resolvedParams.slug
  });
  // NO viewport here
}

// --- ADD SEPARATE VIEWPORT EXPORT --- 
export const viewport: Viewport = {
  themeColor: '#FFFFFF', // Example theme color
  // Add other viewport settings as needed
  // e.g., width: 'device-width', initialScale: 1,
};

// --- Fetch Data for Specific Page (Keep) ---
async function getPageData(slug: string): Promise<Section[] | undefined> {
  const data = await getPageSectionsData();
  const key = `products/${slug}`;
  return data[key];
}

// --- Type for Page Props ---
type Props = {
  // params is passed as a Promise to async Server Components
  params: Promise<{ slug: string; locale: string }>; 
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Optional: Include if needed
};

// --- Page Component (Keep) ---
export default async function ProductPage({ params: paramsPromise }: Props) { 
  const params = await paramsPromise;

  // Validate and set locale using routing.locales
  if (!routing.locales.includes(params.locale as typeof routing.locales[number])) {
      console.error(`[ProductPage] Invalid locale: ${params.locale}. Calling notFound().`);
      notFound();
  }
  try {
      // Use correct type for setRequestLocale if needed
      setRequestLocale(params.locale as typeof routing.locales[number]); 
  } catch {
      // Decide how to handle this - maybe call notFound() or return error page
      notFound(); 
  }

  // Fetch sections data using the existing function
  const sections = await getPageData(params.slug); 

  if (!sections || sections.length === 0) {
    const pageKey = `products/${params.slug}`;
    console.error(`[ProductPage] No sections found for key: ${pageKey} in pageSections.json. Calling notFound().`);
    notFound();
  }

  // Construct pageUrl
  const pageUrl = `products/${params.slug}`;

  return <DynamicSectionPage sectionsData={sections} pageUrl={pageUrl} locale={params.locale} />;
}
