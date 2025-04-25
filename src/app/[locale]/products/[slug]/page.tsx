import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import DynamicSectionPage from '@/components/pages/DynamicSectionPage'; // Import the central component
import { setRequestLocale } from 'next-intl/server'; // Import for setting locale
import { routing } from '@/i18n/routing'; // Import routing config

// Remove hardcoded locales
// const locales = ["en", "zh"];

// --- Component Imports ---
// TODO: Import your actual section components here
// Example:

// TODO: Create the component map

// --- Data Types ---
// Simplified - DynamicSectionPage handles the detailed types
// Re-added definitions needed for function signatures
interface Section {
  component: string;
  props: Record<string, unknown>;
}

interface PageData {
  [key: string]: Section[];
}

// --- Data Fetching (Keep as is) ---
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

// --- Generate Static Paths (Updated for locales) ---
export async function generateStaticParams() {
  const data = await getPageSectionsData();
  const productKeys = Object.keys(data).filter(key => key.startsWith('products/'));
  const productSlugs = productKeys.map(key => key.replace('products/', ''));

  // Use routing.locales here
  const params = routing.locales.flatMap((locale: string) => 
    productSlugs.map(slug => ({
      locale,
      slug,
    }))
  );

  return params;
  // Example output: 
  // [
  //   { locale: 'en', slug: 'restaurant-online-ordering-system' },
  //   { locale: 'zh', slug: 'restaurant-online-ordering-system' },
  //   { locale: 'en', slug: 'restaurant-reservation-system' },
  //   { locale: 'zh', slug: 'restaurant-reservation-system' }
  // ]
}

// --- Fetch Data for Specific Page (Keep as is) ---
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

// --- Page Component (Updated for locale and Props type) ---
export default async function ProductPage({ params: paramsPromise }: Props) { 
  // Await the params promise
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

  // Fetch data 
  const sections = await getPageData(params.slug);
  // Log the fetched sections

  // Check if sections are valid before rendering
  if (!sections || sections.length === 0) {
    notFound(); 
  }

  // Construct pageUrl
  const pageUrl = `products/${params.slug}`;

  return <DynamicSectionPage sectionsData={sections} pageUrl={pageUrl} locale={params.locale} />;
}

// Optional: Add metadata generation based on page data (Consider locale)
// export async function generateMetadata({ params }: { params: { slug: string; locale: string } }) {
//   // Fetch locale-specific messages if needed for title
//   // const messages = (await import(`@/messages/${params.locale}.json`)).default;

//   const sections = await getPageData(params.slug);
//   const pageTitle = sections?.[0]?.props?.title || params.slug.replace(/-/g, ' ');
//
//   return {
//     title: pageTitle, // Potentially use translated title
//   };
// } 