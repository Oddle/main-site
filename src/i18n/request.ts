import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Helper to safely get nested values from an object using a dot-separated key
function getNestedValue(obj: Record<string, unknown> | null | undefined, key: string): string | undefined {
  if (!obj) {
    return undefined;
  }
  let current: unknown = obj; // Use unknown instead of any
  const keys = key.split('.');

  for (const k of keys) {
    // Type guard to ensure current is an indexable object
    if (current && typeof current === 'object' && k in current) {
       // We need to assert the type to access the property
       current = (current as Record<string, unknown>)[k];
    } else {
      return undefined; // Key path doesn't exist or current is not an object
    }
  }

  // After the loop, check if the final value is a string
  return typeof current === 'string' ? current : undefined;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  // Determine the effective locale, falling back to default if needed
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  let messages;
  let enMessages; // Variable to hold English messages

  try {
    // Load messages for the current locale
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    // Fallback to an empty object if messages fail to load
    messages = {};
  }

  try {
    // Always load English messages for fallback
    enMessages = (await import(`../../messages/sg.json`)).default;
  } catch (error) {
    console.error(`Could not load fallback English messages (sg.json)`, error);
    enMessages = {}; // Fallback to empty object if English messages fail
  }

  return {
    locale,
    messages,
    // --- Add fallback configuration --- 
    getMessageFallback: ({ key, namespace }) => {
      // Construct the full key including the namespace if it exists
      const fullKey = namespace ? `${namespace}.${key}` : key;

      // Try to get the translation from English messages using the helper
      const fallbackTranslation = getNestedValue(enMessages, fullKey);

      if (fallbackTranslation !== undefined) {
        // If found in English messages...
        // Log warning only if the current locale is NOT English during development
        if (locale !== 'en' && process.env.NODE_ENV === 'development') {
           console.warn(`Using 'en' fallback for key: ${fullKey} (locale: ${locale})`);
        }
        // Return the English translation
        return fallbackTranslation;
      } else {
        // If not found in English either...
        // Log a warning during development
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation key in 'en' as well: ${fullKey}`);
        }
        // Return the key itself as the final fallback
        return fullKey;
      }
    }
    // -------------------------------------
  };
});
