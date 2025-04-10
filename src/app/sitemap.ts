import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing"; // Import routing config

// Read the base URL from environment variables
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Fallback if not set

export default function sitemap(): MetadataRoute.Sitemap {
  // Get locales dynamically from routing config
  const locales = routing.locales;

  // Base URL entry (homepage)
  const homeEntry: MetadataRoute.Sitemap[number] = {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
  };

  // Generate entries for each locale's root page
  const localeEntries = locales.map((locale): MetadataRoute.Sitemap[number] => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly", // Keep 'as const' if needed, but often optional
      priority: 0.8,
  }));

  // Combine and return (add other static/dynamic pages as needed)
  return [
      homeEntry,
      ...localeEntries,
      // Example: Add an 'about' page for each locale
      // ...locales.map((locale): MetadataRoute.Sitemap[number] => ({
      //     url: `${baseUrl}/${locale}/about`,
      //     lastModified: new Date(),
      //     changeFrequency: "yearly",
      //     priority: 0.5,
      // })),
  ];
}
