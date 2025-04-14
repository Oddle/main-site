import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import DynamicSectionPage from '@/components/pages/DynamicSectionPage'; // Import the central component
import { setRequestLocale } from 'next-intl/server'; // Import for setting locale

// Define locales directly as they are not exported from routing.ts
const locales = ["en", "zh"];

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

  // Generate params for each locale and each slug combination
  const params = locales.flatMap((locale: string) => // Added type annotation for locale
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
export default async function ProductPage({ params: paramsPromise }: Props) { // Renamed prop to avoid shadowing
  // Await the params promise to get the actual parameters
  const params = await paramsPromise;

  // Validate and set the locale for static rendering
  if (!locales.includes(params.locale)) notFound();
  setRequestLocale(params.locale);

  // Fetch data using the resolved slug
  const sections = await getPageData(params.slug);

  if (!sections || sections.length === 0) {
    notFound(); // Show 404 if no sections found
  }

  // Construct the pageUrl for the FaqSection
  const pageUrl = `products/${params.slug}`;

  // Use the central DynamicSectionPage component to render the sections
  // Pass pageUrl and locale down
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