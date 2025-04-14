import { type useTranslations } from 'next-intl';

// Type for the 't' function returned by useTranslations
type TFunction = ReturnType<typeof useTranslations>;

/**
 * Gets a translation using the provided t function.
 * Falls back to the defaultValue if the key is not found,
 * if t() returns the key itself, or if t() returns an empty string.
 * Also catches errors thrown by t().
 */
export const getTranslation = (
  t: TFunction, // Accept the 't' function as an argument
  key: string,
  defaultValue: string
): string => {
  try {
    const translation = t(key);
    // If t() returns the key itself or an empty string, consider it missing
    if (translation === key || translation === '') {
      // Optional: only warn if not intentionally using key as value
      // if (defaultValue !== key) {
      //   console.warn(`Missing translation for key: ${key}. Using default.`);
      // }
      return defaultValue;
    }
    return translation;
  } catch (_e) {
    // If t() throws an error on missing key, catch it and return default
    // Using console.warn to avoid breaking builds if _e isn't used
    console.warn(`Error translating key: ${key}. Using default. Error: ${_e}`);
    return defaultValue;
  }
};

// Add other i18n related utils here in the future 