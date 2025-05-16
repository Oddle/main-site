import { routing } from "@/i18n/routing";
import pageSectionsData from '@/data/pageSections.json';
import { NextResponse } from 'next/server'; // Import NextResponse
import { getPublishedPosts, PostSummary } from '@/lib/notion'; // Import function and type

// Read the base URL from environment variables
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Fallback if not set

// Define the type for changeFrequency explicitly
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// Define the type for a sitemap entry
interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: ChangeFrequency;
  priority?: number;
}

// Helper function to generate XML sitemap string
function generateSitemapXml(entries: SitemapEntry[]): string { // Use SitemapEntry type
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  entries.forEach(entry => {
    xml += '  <url>\n';
    xml += `    <loc>${entry.url}</loc>\n`;
    if (entry.lastModified) {
      xml += `    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>\n`;
    }
    if (entry.changeFrequency) {
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
    }
    if (entry.priority !== undefined) { // Check for undefined as 0 is a valid priority
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ locale: string }> } // Type params as Promise
) {
  // Explicitly await the params object
  const params = await context.params;
  const locale = params.locale;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    // Use NextResponse for error response
    return new NextResponse('Not found', { status: 404 });
  }

  // Use the defined SitemapEntry type
  const sitemapEntries: SitemapEntry[] = [];

  // Add the locale's root page
  sitemapEntries.push({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly", // Value conforms to ChangeFrequency type
    priority: 0.8,
  });

  // Generate entries for dynamic pages for this locale
  const dynamicPagePaths = Object.keys(pageSectionsData).filter(path => path !== 'home'); // Exclude 'home'

  dynamicPagePaths.forEach((pagePath) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/${pagePath}`,
      lastModified: new Date(),
      changeFrequency: "monthly", // Value conforms to ChangeFrequency type
      priority: 0.7,
    });
  });

  // Generate entries for static pages for this locale
  const staticPagePaths = Object.keys(pageSectionsData).filter(path => path !== 'home');
  staticPagePaths.forEach((pagePath) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/${pagePath}`,
      lastModified: new Date(),
      changeFrequency: "monthly", // Value conforms to ChangeFrequency type
      priority: 0.7,
    });
  });

  // --- Add Blog Post Entries --- 
  const posts: PostSummary[] = await getPublishedPosts(locale);

  posts.forEach(post => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/blog/${post.slug}`, 
      // Use publishDate if available, otherwise fallback to current date
      lastModified: post.publishDate ? new Date(post.publishDate) : new Date(), 
      changeFrequency: "weekly", // Or 'monthly' depending on update frequency
      priority: 0.9, // Higher priority for content
    });
  });
  // --- End Blog Post Entries --- 

  // Generate the XML string
  const sitemapXml = generateSitemapXml(sitemapEntries);

  // Return the XML response using NextResponse
  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 