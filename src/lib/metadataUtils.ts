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
  // Fetch metadata for both the specific page and the homepage for fallbacks
  const pageMetadata = await getMetadataByKey(pageKey);
  const homeMetadata = await getMetadataByKey('home'); // Fetch home metadata

  // --- Title --- 
  let finalTitle = pageMetadata?.title;
  if (!finalTitle) {
    // Fallback 1: Try homepage title
    finalTitle = homeMetadata?.title;
  }
  if (!finalTitle) {
    // Fallback 2: Derive from slug or pageKey
    let fallbackTitle = pageKey === 'home' ? 'Oddle' : pageKey; // Default fallback
    if (slug) { 
        fallbackTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    finalTitle = fallbackTitle;
  }

  // --- Description --- 
  let description = pageMetadata?.description;
  if (!description) {
    description = homeMetadata?.description;
  }
  // Add final fallback for description
  description = description || 'Oddle empowers restaurants globally...'; // Add your default description
  
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

  // --- Image URLs --- 
  // Add final fallback URLs (replace with your actual defaults)
  const defaultOgImageUrl = pageMetadata?.ogImage || homeMetadata?.ogImage || '/default-og.png'; 
  const defaultTwitterImageUrl = pageMetadata?.twitterImage || pageMetadata?.ogImage || homeMetadata?.twitterImage || homeMetadata?.ogImage || '/default-twitter.png'; 
  
  // --- Construct Metadata Object --- 
  const result: Metadata = {
    title: finalTitle,
    description: description, // Use final description
    alternates: {
      canonical: canonicalPath,
      languages: languages,
    },
    openGraph: {
      title: finalTitle, 
      description: description, 
      url: canonicalPath, 
      siteName: 'Oddle', 
      images: [
        { 
          url: defaultOgImageUrl, // Now guaranteed to be a string
          width: 1200, 
          height: 630, 
        },
      ],
      locale: locale,
      type: 'website', 
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: description,
      images: [defaultTwitterImageUrl], // Now guaranteed to be a string
    },
  };
  return result;
} 