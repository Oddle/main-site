import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { routing } from '@/i18n/routing';

// --- Types (can be shared or redefined here) ---
interface PageMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
  twitterImage?: string;
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
  if (pageKey === 'home' && !pageTitle) {
      fallbackTitle = 'Oddle'; 
  }
  const finalTitle = pageTitle || fallbackTitle;

  // --- Description --- 
  const description = metadata?.description || 'Default description for Oddle site.'; // Add a default description

  // --- Canonical Path --- 
  const canonicalPath = pageKey === 'home' ? '/' : `/${pageKey}`;
  
  // --- Language Alternates --- 
  const languages: Record<string, string> = {};
  routing.locales.forEach(loc => {
      const pathSegment = pageKey === 'home' ? '' : `/${pageKey}`;
      languages[loc] = `/${loc}${pathSegment}`;
  });
  const defaultPathSegment = pageKey === 'home' ? '' : `/${pageKey}`;
  languages['x-default'] = `/${routing.defaultLocale}${defaultPathSegment}`;

  // --- Image URLs (Replace with your actual default image URLs) --- 
  // Should be relative to metadataBase or absolute URLs
  const defaultOgImageUrl = metadata?.ogImage || 'https://ucarecdn.com/3a4499ff-d4db-43e9-9db2-5f19976dcf78/-/preview/1000x523/'; 
  const defaultTwitterImageUrl = metadata?.twitterImage || defaultOgImageUrl; // Often the same as OG image
  // -----------------------------------------------------------------
  
  // --- Construct Metadata Object --- 
  const result: Metadata = {
    title: finalTitle,
    description: description, // Add standard meta description
    alternates: {
      canonical: canonicalPath,
      languages: languages,
    },
    openGraph: {
      title: finalTitle, 
      description: description, 
      url: canonicalPath, // Relative path (Next.js combines with metadataBase)
      siteName: 'Oddle', 
      images: [
        { // Add OG image
          url: defaultOgImageUrl, // Use defined image URL
          width: 1200, // Standard OG width
          height: 630, // Standard OG height
        },
      ],
      locale: locale,
      type: 'website', 
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: description,
      images: [defaultTwitterImageUrl], // Add Twitter image URL (can be relative)
      // site: '@YourTwitterHandle', // Optional: Add your site's Twitter handle
    },
     // Optional: Add default robots tag if needed
    // robots: { index: true, follow: true },
  };
  return result;
} 