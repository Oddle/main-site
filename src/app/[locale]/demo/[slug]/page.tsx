import { setRequestLocale } from "next-intl/server";
import DynamicSectionPage from "@/components/pages/DynamicSectionPage";
import pageSectionsData from '@/data/pageSections.json';
import { notFound } from 'next/navigation';

export default async function DemoSlugPage({ params }: { params: { locale: string; slug: string } }) {
  // Ensure params are properly awaited first
  const { locale, slug } = await Promise.resolve(params);

  // Set the locale after awaiting params
  await setRequestLocale(locale);

  // Use the slug to get the correct section data
  const sectionsData = (pageSectionsData as any)[`demo/${slug}`];

  // If no sections data is found for this slug, return 404
  if (!sectionsData) {
    console.error(`[DemoSlugPage] No sections found for slug: ${slug}`);
    notFound();
  }

  return (
    <DynamicSectionPage
      sectionsData={sectionsData}
      locale={locale}
      pageUrl={`/demo/${slug}`}
    />
  );
} 