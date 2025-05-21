import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { routing } from '@/i18n/routing';

// Define BCP 47 language mapping
const bcp47LangMap: { [key: string]: string } = {
  en: 'en',
  sg: 'en-SG',
  hk: 'en-HK',
  au: 'en-AU',
  my: 'en-MY',
  tw: 'zh-TW',
};

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
  
  // --- Base URL for absolute path generation ---
  const baseUrl = new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  // --- Paths for current locale and alternates --- 
  const pathSegmentForPaths = pageKey === 'home' ? '' : `/${pageKey.startsWith('/') ? pageKey.substring(1) : pageKey}`;
  const fullyQualifiedPathForCurrentPage = new URL(`/${locale}${pathSegmentForPaths}`, baseUrl).toString();
  
  const languages: Record<string, string> = {};
  routing.locales.forEach(loc => {
      const mappedHreflang = bcp47LangMap[loc] || loc;
      languages[mappedHreflang] = new URL(`/${loc}${pathSegmentForPaths}`, baseUrl).toString();
  });

  const defaultLocaleForXDefault = routing.defaultLocale || 'sg'; // Fallback for safety
  languages['x-default'] = new URL(`/${defaultLocaleForXDefault}${pathSegmentForPaths}`, baseUrl).toString();

  // --- Image URLs --- 
  // Add final fallback URLs (replace with your actual defaults)
  const defaultOgImageUrl = pageMetadata?.ogImage || homeMetadata?.ogImage || '/default-og.png'; 
  const defaultTwitterImageUrl = pageMetadata?.twitterImage || pageMetadata?.ogImage || homeMetadata?.twitterImage || homeMetadata?.ogImage || '/default-twitter.png'; 
  
  // --- Construct Metadata Object --- 
  const result: Metadata = {
    title: finalTitle,
    description: description, // Use final description
    openGraph: {
      title: finalTitle, 
      description: description, 
      url: fullyQualifiedPathForCurrentPage, // Use locale-specific path
      siteName: 'Oddle', 
      images: [
        { 
          url: defaultOgImageUrl, // Now guaranteed to be a string
          width: 1200, 
          height: 630, 
        },
      ],
      locale: bcp47LangMap[locale] || locale, // Use mapped BCP47 locale
      type: 'website', 
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: description,
      images: [defaultTwitterImageUrl], // Now guaranteed to be a string
    },
    alternates: {
      canonical: fullyQualifiedPathForCurrentPage, // Use absolute locale-specific path
      languages: languages,
    },
  };
  return result;
} 