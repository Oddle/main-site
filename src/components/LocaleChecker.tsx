// src/components/LocaleChecker.tsx
"use client"; // Required for hooks and state management

import React, { useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import LocationDialog from './LocationDialog'; // Import the dialog
import { routing } from '@/i18n/routing';

// --- Configuration ---
const USER_CHOICE_STORAGE_KEY = 'userSelectedLocale'; // For persistent user choice
const PROMPT_DISMISSED_SESSION_KEY = 'locationPromptDismissed'; // For session-based dismissal

// --- Regex to identify common bots ---
const BOT_REGEX = /bot|google|baidu|bing|slurp|duckduck|spider|crawler|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp/i;
// -----------------------------------

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

  const [geoIpCountry, setGeoIpCountry] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog

  // Memoize handlers to prevent unnecessary re-renders if passed down
  const dismissPrompt = useCallback(() => {
    setIsDialogOpen(false); // Close the dialog
    try { sessionStorage.setItem(PROMPT_DISMISSED_SESSION_KEY, 'true'); }
    catch (error) { console.warn("Could not write to sessionStorage:", error); }
  }, []);

  const switchToLocale = useCallback((targetLocale: string) => {
    if (!targetLocale) return;
    const lowerCaseTargetLocale = targetLocale.toLowerCase();
    setIsDialogOpen(false); // Close the dialog
    try {
      localStorage.setItem(USER_CHOICE_STORAGE_KEY, lowerCaseTargetLocale);
    } catch (error) {
      console.warn("Could not write to localStorage:", error);
    }
    // Correct path construction
    const pathWithoutLocale = pathname.replace(/^\/([a-z]{2})(\/|$)/, '/');
    const newPath = `/${lowerCaseTargetLocale}${pathWithoutLocale}`;
    router.push(newPath);
  }, [pathname, router]);

  useEffect(() => {
    // Ensure running client-side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return;
    }

    // ===== BOT DETECTION =====
    if (BOT_REGEX.test(navigator.userAgent)) {
        console.log("Bot detected, skipping locale check dialog.");
        return; // Don't run checks or show dialog for bots
    }
    // =========================

    let isMounted = true;
    const checkLocale = async () => {
      // Normal checks
      const userSelectedLocale = localStorage.getItem(USER_CHOICE_STORAGE_KEY);
      if (userSelectedLocale) return;
      const promptDismissed = sessionStorage.getItem(PROMPT_DISMISSED_SESSION_KEY);
      if (promptDismissed) return;
      const browserLang = navigator.language;
      const browserRegion = getRegionFromNavigator(browserLang);
      const regionMismatch = browserRegion && browserRegion.toLowerCase() !== currentLocale.toLowerCase();
      if (regionMismatch) {
        try {
          const response = await fetch('/api/geoip');
          if (!response.ok) {
            console.warn(`GeoIP API request failed: ${response.status}`);
            return;
          }
          const data = await response.json();
          if (isMounted && data.country) {
            const detectedCountryLower = data.country.toLowerCase();
            if (detectedCountryLower !== currentLocale.toLowerCase()) {
              setGeoIpCountry(data.country);
              setIsDialogOpen(true); // Open the dialog
            }
          }
        } catch (error) {
          console.error('Error fetching GeoIP:', error);
        }
      }
    };
    checkLocale();
    return () => { isMounted = false; };
  }, [currentLocale]);

  // Render the Dialog conditionally
  if (geoIpCountry) { // Only render if we have a detected country
    return (
      <LocationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen} // Pass state setter for closing via overlay/esc
        detectedCountry={geoIpCountry}
        currentLocale={currentLocale}
        supportedLocales={routing.locales} // Pass supported locales
        onConfirm={switchToLocale}       // Pass confirm handler
        onDismiss={dismissPrompt}      // Pass dismiss handler
      />
    );
  }

  return null; // Render nothing if no prompt is needed
}

export default LocaleChecker;