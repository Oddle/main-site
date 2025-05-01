// src/components/LocaleChecker.tsx
"use client"; // Required for hooks and state management

import React, { useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation'; // Use hooks from next/navigation for App Router
import LocationBanner from './LocationBanner';

// --- Configuration ---
const USER_CHOICE_STORAGE_KEY = 'userSelectedLocale'; // For persistent user choice
const PROMPT_DISMISSED_SESSION_KEY = 'locationPromptDismissed'; // For session-based dismissal

// Helper to extract region from language tag (improves robustness)
function getRegionFromNavigator(langTag: string | undefined): string | null {
  if (!langTag) return null;
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.Locale !== 'undefined') {
        const localeObj = new Intl.Locale(langTag);
        return localeObj.region ? localeObj.region.toUpperCase() : null; // e.g., 'US' from 'en-US'
    }
    const parts = langTag.split('-');
    if (parts.length > 1) return parts[parts.length - 1].toUpperCase();
  } catch (e) { console.warn("Could not parse navigator language tag:", langTag, e); }
  return null;
}


function LocaleChecker() {
  const currentLocale = useLocale(); // Locale resolved by next-intl ('sg', 'hk', etc.)
  const router = useRouter();
  const pathname = usePathname(); // Gets the path *without* the locale prefix

  const [showPrompt, setShowPrompt] = useState(false);
  const [geoIpCountry, setGeoIpCountry] = useState<string | null>(null);

  // Memoize handlers to prevent unnecessary re-renders if passed down
  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    try { sessionStorage.setItem(PROMPT_DISMISSED_SESSION_KEY, 'true'); }
    catch (error) { console.warn("Could not write to sessionStorage:", error); }
  }, []);

  const switchToLocale = useCallback((targetLocale: string) => {
    if (!targetLocale) return;
    const lowerCaseTargetLocale = targetLocale.toLowerCase(); // Ensure lowercase

    // Assuming setShowPrompt is managed where the banner is rendered or via props/context
    // If LocaleChecker itself manages showPrompt state, uncomment the line below:
    // setShowPrompt(false);

    try {
      // Store the user's choice persistently
      localStorage.setItem(USER_CHOICE_STORAGE_KEY, lowerCaseTargetLocale);
    } catch (error) {
      console.warn("Could not write to localStorage:", error);
    }

    // Construct the new path with the locale prefix
    // pathname from usePathname() does NOT include the current locale prefix
    const newPath = `/${lowerCaseTargetLocale}${pathname}`;

    // Push the full new path string
    router.push(newPath);

  }, [pathname, router]); // Include dependencies

  useEffect(() => {
    // Check if window/navigator are available (runs only client-side)
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    let isMounted = true; // Flag to prevent state updates on unmounted component

    const checkLocale = async () => {
      // 1. Check for persistent user choice
      const userSelectedLocale = localStorage.getItem(USER_CHOICE_STORAGE_KEY);
      if (userSelectedLocale) return; // Respect user's choice

      // 2. Check if prompt was dismissed this session
      const promptDismissed = sessionStorage.getItem(PROMPT_DISMISSED_SESSION_KEY);
      if (promptDismissed) return;

      // 3. Check for browser language vs current locale mismatch
      const browserLang = navigator.language; // e.g., 'en-US', 'zh-HK'
      const browserRegion = getRegionFromNavigator(browserLang); // e.g., 'US', 'HK'

      const regionMismatch = browserRegion && browserRegion.toLowerCase() !== currentLocale.toLowerCase();

      if (regionMismatch) {
        // 4. Perform IP Lookup (Only if needed)
        try {
          const response = await fetch('/api/geoip'); // Fetch from the updated API route
          if (!response.ok) throw new Error(`GeoIP API request failed: ${response.status}`);
          const data = await response.json();

          if (isMounted && data.country) {
            const detectedCountry = data.country.toLowerCase(); // API returns uppercase, ensure lowercase for comparison
            // 5. Prompt if GeoIP differs from current locale
            if (detectedCountry !== currentLocale.toLowerCase()) {
              setGeoIpCountry(data.country); // Store the original case (e.g., 'SG') for display
              setShowPrompt(true);
            }
          }
        } catch (error) {
          console.error('Error fetching or processing GeoIP:', error);
        }
      }
    };

    checkLocale();

    // Cleanup function
    return () => { isMounted = false; };
  }, [currentLocale]); // Dependency array

  if (showPrompt && geoIpCountry) {
    return (
      <LocationBanner
        detectedCountry={geoIpCountry} // Already uppercase from API/helper
        currentLocale={currentLocale.toUpperCase()}
        onDismiss={dismissPrompt}
        onSwitch={() => switchToLocale(geoIpCountry)} // Pass the original case country code
      />
    );
  }

  return null; // Render nothing if no prompt is needed
}

export default LocaleChecker;