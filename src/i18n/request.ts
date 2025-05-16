import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import deepmerge from 'deepmerge'; // Import deepmerge

const fallbackLocale = 'sg'; // Define fallback locale

// Helper to load messages, returns null on error
async function loadMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.warn(`Could not load messages for locale: ${locale}. File might be missing or invalid JSON.`, error);
    return null; // Return null if file not found or invalid
  }
}

// Helper to safely get nested values from an object using a dot-separated key
// function getNestedValue(obj: Record<string, unknown> | null | undefined, key: string): string | undefined {
//   if (!obj) {
//     return undefined;
//   }
//   let current: unknown = obj; // Use unknown instead of any
//   const keys = key.split('.');
// 
//   for (const k of keys) {
//     // Type guard to ensure current is an indexable object
//     if (current && typeof current === 'object' && k in current) {
//        // We need to assert the type to access the property
//        current = (current as Record<string, unknown>)[k];
//     } else {
//       return undefined; // Key path doesn't exist or current is not an object
//     }
//   }
// 
//   // After the loop, check if the final value is a string
//   return typeof current === 'string' ? current : undefined;
// }

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load messages for the current locale and the fallback locale
  const localeMessages = await loadMessages(locale);
  let fallbackMessages = null;

  if (locale !== fallbackLocale) {
    fallbackMessages = await loadMessages(fallbackLocale);
  }

  // Start with an empty object
  let messages = {};

  // Add fallback messages first (if they loaded)
  if (fallbackMessages) {
      messages = deepmerge(messages, fallbackMessages);
  } else if (locale !== fallbackLocale) {
      console.warn(`Could not load fallback messages for locale: ${fallbackLocale}`);
  }

  // Add current locale messages, overriding fallback where keys overlap
  if (localeMessages) {
      messages = deepmerge(messages, localeMessages);
  } else {
      console.error(`FAILED to load messages for locale: ${locale}. Only fallback messages (if any) will be available.`);
  }
  
  return {
    locale,
    messages: messages, // Provide the merged messages
    // Remove getMessageFallback configuration
    // getMessageFallback: ... 
  };
});
