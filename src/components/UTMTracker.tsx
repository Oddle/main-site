"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Define interface for attribution data
interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string | null;
  page_url?: string;
  // Add other potential fields if known
}

// --- Helper Functions (adapted for client-side) ---

// Function to set a cookie (browser API)
function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  // Ensure the cookie value is properly encoded
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`; // Added SameSite=Lax
}

// Function to get a cookie (browser API)
function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      // Ensure the cookie value is properly decoded
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

// Function to capture the referrer (browser API)
function getReferrer(): string | null {
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        // Only return referrer if it's from a different domain
        if (referrerUrl.hostname !== currentDomain) {
          return referrer;
        }
      } catch (e) {
         // Malformed referrer URL, ignore
         console.error("Error parsing referrer URL:", e);
         return null;
      }
    } else {
      return "direct entry"; // Explicitly mark direct visits
    }
    return null; // Referrer exists but is internal
}

// Function to get the current page URL (browser API)
function getCurrentPageURL(): string {
    return window.location.href;
}


// --- React Component ---

export function UtmTracker() {
  const searchParams = useSearchParams(); // Hook to get URL search parameters

  useEffect(() => {
    // 1. Extract UTM parameters from current URL
    const utmParams: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    });
    const hasNewUtmParams = Object.keys(utmParams).length > 0;

    // 2. Get referrer and current URL
    const referrer = getReferrer(); 
    const pageURL = getCurrentPageURL();

    // 3. Get existing cookie data
    let existingData: AttributionData = {}; // Use AttributionData type
    const existingDataStr = getCookie('attribution_data');
    if (existingDataStr) {
      try {
        existingData = JSON.parse(existingDataStr) as AttributionData; // Type assertion
      } catch (e) {
        console.error('Error parsing existing attribution data cookie:', e);
      }
    }

    // 4. Determine if an update is needed
    // Update if new UTMs are present, or if referrer needs initial capture,
    // or simply if the page URL changed (to keep page_url fresh)
    const shouldCaptureNewReferrer = referrer !== null && existingData.referrer === undefined;
    const needsUpdate = hasNewUtmParams || shouldCaptureNewReferrer || (existingDataStr && existingData.page_url !== pageURL);

    if (needsUpdate) {
      // 5. Construct the data using last-touch logic (merge/overwrite)
      const newData: AttributionData = { // Use AttributionData type
        // Start with existing data 
        ...existingData,
        // Overwrite with new UTMs if present, adds new ones too.
        // Old UTMs persist if not overwritten by a new one with the same key.
        ...utmParams,   
        // Capture referrer only if it's the first time
        referrer: referrer !== null && existingData.referrer === undefined 
                    ? referrer 
                    : (existingData.referrer || "direct entry"), // Keep existing or default to direct
        // Always update the page URL
        page_url: pageURL,
      };
      
      // 6. Store updated data in cookie
      setCookie('attribution_data', JSON.stringify(newData), 30); 
      console.log("Attribution Data Updated (Last Touch Logic):", newData);
    } else {
        // Optional: Log when no update is performed
        // console.log("Attribution Data - No Update Needed.");
    }

  }, [searchParams]);

  // This component doesn't render anything visible
  return null;
} 