import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import type { SectionDefinition } from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json';
import { notFound } from 'next/navigation';

// Import the metadata helper and Metadata type
import { generatePageMetadata } from '@/lib/metadataUtils';
import type { Metadata } from 'next';

// Define Props type with params as a Promise
type Props = {
  params: Promise<{ locale: string; slug: string }>; // Correct: params is a Promise
}

export default async function DemoSlugPage({ params: paramsPromise }: Props) { // Rename params to paramsPromise to avoid shadowing
  // Await the params promise
  const params = await paramsPromise;
  const { locale, slug } = params; // Now destructure the resolved params

  // Set the locale
  await setRequestLocale(locale);

  // Use the slug to get the correct section data
  const sectionsData: SectionDefinition[] | undefined = (pageSectionsData as Record<string, SectionDefinition[]>)[`demo/${slug}`]; // Add undefined possibility

  // If no sections data is found for this slug, return 404
  if (!sectionsData) {
    console.error(`[DemoSlugPage] No sections found for slug: ${slug}`);
    notFound();
  }

  return (
    <DynamicSectionPage
      sectionsData={sectionsData} // sectionsData could be undefined, DynamicSectionPage should handle this
      locale={locale}
      pageUrl={`/demo/${slug}`}
    />
  );
}

// Generate metadata for the Demo Slug page
export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<{ slug: string; locale: string }> }
): Promise<Metadata> {
  const params = await paramsPromise;

  return generatePageMetadata({ 
    locale: params.locale, 
    pageKey: `demo/${params.slug}`, 
    slug: params.slug 
  });
} 