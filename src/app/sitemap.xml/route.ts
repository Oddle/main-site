// Remove MetadataRoute import as it's not used for route handlers
// import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing"; // Import routing config
// Remove pageSectionsData import as it's not needed for the index
// import pageSectionsData from "@/data/pageSections.json";
import { NextResponse } from 'next/server'; // Import NextResponse

// Read the base URL from environment variables
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Fallback if not set

// Remove the old sitemap function
/*
export default function sitemap(): MetadataRoute.Sitemap {
  // ... (old sitemap generation logic) ...
}
*/

// Helper function to generate XML sitemap index string
function generateSitemapIndexXml(locales: readonly string[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  locales.forEach(locale => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${baseUrl}/${locale}/sitemap.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';
  return xml;
}

export async function GET() {
  const locales = routing.locales;

  // ... (keep existing commented out section) ...
  /*
  const sitemapIndexEntries = [
    {
      loc: `${baseUrl}/sitemap-base.xml`, // Example path for a base sitemap
      lastmod: new Date(),
    },
    ...locales.map(locale => ({
      loc: `${baseUrl}/${locale}/sitemap.xml`,
      lastmod: new Date(),
    }))
  ];
  */

  const sitemapIndexXml = generateSitemapIndexXml(locales);

  // Return the XML response using NextResponse
  return new NextResponse(sitemapIndexXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
