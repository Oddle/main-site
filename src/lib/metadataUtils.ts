import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { routing } from '@/i18n/routing';

// --- Types (can be shared or redefined here) ---
interface PageMetadata {
  title?: string;
  description?: string;
}

// --- Data Fetching Logic (centralized) ---
// Cache results to avoid re-reading the file multiple times per request
let metadataCache: { [key: string]: PageMetadata } | null = null;

async function getAllMetadata(): Promise<{ [key: string]: PageMetadata }> {
  if (metadataCache) {
    return metadataCache;
  }
  const filePath = path.join(process.cwd(), 'src/data/metadata.json');
  try {
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    metadataCache = JSON.parse(fileContents);
    return metadataCache || {}; // Ensure return is not null
  } catch (error) {
    console.error("Error reading or parsing metadata.json in helper:", error);
    return {};
  }
}

async function getMetadataByKey(pageKey: string): Promise<PageMetadata | undefined> {
  const allMetadata = await getAllMetadata();
  return allMetadata[pageKey];
}

// --- Main Helper Function ---
interface GenerateMetadataParams {
  locale: string;
  pageKey: string;
  slug?: string; // Optional slug for fallback title generation
}

export async function generatePageMetadata({ locale, pageKey, slug }: GenerateMetadataParams): Promise<Metadata> {
  const metadata = await getMetadataByKey(pageKey);

  // --- Title --- 
  const pageTitle = metadata?.title;
  let fallbackTitle = pageKey; 
  if (slug) { 
      fallbackTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  // Handle homepage fallback specifically
  if (pageKey === 'home' && !pageTitle) {
      fallbackTitle = 'Oddle'; // Or your default site name
  }
  const finalTitle = pageTitle || fallbackTitle;

  // --- Description (Renamed variable) --- 
  const description = metadata?.description; // Renamed from finalDescription

  // --- Canonical Path (relative) - Handle homepage case --- 
  const canonicalPath = pageKey === 'home' ? '/' : `/${pageKey}`;
  // ------------------------------------------------------

  // --- Language Alternates (relative) - Handle homepage case --- 
  const languages: Record<string, string> = {};
  routing.locales.forEach(loc => {
      // Construct path conditionally based on pageKey
      const pathSegment = pageKey === 'home' ? '' : `/${pageKey}`;
      languages[loc] = `/${loc}${pathSegment}`; // e.g., /en or /en/products/slug
  });
  // Handle x-default similarly
  const defaultPathSegment = pageKey === 'home' ? '' : `/${pageKey}`;
  languages['x-default'] = `/${routing.defaultLocale}${defaultPathSegment}`;
  // -----------------------------------------------------------

  // --- Construct Metadata Object --- 
  const result: Metadata = {
    title: finalTitle,
    ...(description && { description: description }), // Use renamed variable
    alternates: {
      canonical: canonicalPath,
      languages: languages,
    },
    // --- Add Page-Specific OG/Twitter --- 
    openGraph: {
      title: finalTitle,
      description: description || 'Default site description', // Use renamed variable
      url: canonicalPath, 
      siteName: 'Oddle', 
      // images: [ ... ], // Add image logic if needed
      locale: locale,
      type: 'website', 
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: description || 'Default site description', // Use renamed variable
      // images: [ ... ], // Add image logic if needed
    },
  };

  return result;
} 