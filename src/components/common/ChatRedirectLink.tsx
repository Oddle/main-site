"use client";

import React, { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react"; // Or pass icon as prop

// --- Helper Functions (defined here or imported) ---
const generateReferenceCode = () => {
  // Ensure this runs only client-side if Math.random is problematic during SSR/build
  if (typeof window === 'undefined') return 'REF-SSR'; 
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `REF-${randomPart}`;
};

const getLocaleAndProductName = () => {
  // Ensure window/document are available
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { locale: 'sg', productName: 'Product' }; // Sensible fallback
  }
  // Extract locale robustly
  const pathParts = window.location.pathname.split("/").filter(part => part.length > 0);
  const locale = pathParts[0] || "sg"; // Assuming first part is locale, fallback sg

  // Extract product name robustly
  const titleParts = document.title.split(" | ");
  let productName = titleParts[0] || 'this product/service'; // Fallback
  if (/demo/i.test(document.title)) {
    productName = `${productName} Demo`;
  }
  return { locale, productName };
};

interface ChatRedirectLinkProps {
  linkText?: string; // Make text optional if children are provided
  className?: string; // Allow passing custom classes
  children?: ReactNode; // Add children prop
}

export default function ChatRedirectLink({ linkText, className, children }: ChatRedirectLinkProps) {

  const handleChatRedirectClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Stop default link navigation
    const { locale, productName } = getLocaleAndProductName();
    const referenceCode = generateReferenceCode();

    // Define dynamic redirect links based on locale
    const baseMessage = `#${referenceCode}\n\nI would like to find out about ${productName}`;
    const links = {
      sg: `https://wa.me/6583616212?text=${encodeURIComponent(baseMessage)}`,
      my: `https://wa.me/6583616212?text=${encodeURIComponent(baseMessage)}`, // Use correct MY number if different
      tw: `https://line.me/R/ti/p/@rkf5936k?text=${encodeURIComponent(baseMessage)}`, // Use correct Line ID
    } as const; // Use 'as const' for stricter type inference
    
    // Define allowed locale keys based on the links object
    type AllowedLocale = keyof typeof links;
    const allowedLocales: AllowedLocale[] = ['sg', 'my', 'tw'];

    // Check if the detected locale is valid, otherwise default to 'sg'
    const validLocale: AllowedLocale = allowedLocales.includes(locale as AllowedLocale)
      ? locale as AllowedLocale 
      : 'sg';
      
    const redirectUrl = links[validLocale];

    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Contact");
    }

    window.open(redirectUrl, "_blank", "noopener,noreferrer"); // Add rel attributes for security

    

  };

  return (
    <Link
      href="#" // Use # as default navigation is prevented
      onClick={handleChatRedirectClick}
      className={className || "group inline-flex items-center text-base font-medium text-primary hover:text-primary/80"} // Default class or use passed one
      // target="_blank" // Not strictly needed as window.open handles it, but can keep for clarity
      // rel="noopener noreferrer" // Set by window.open's 3rd arg
    >
      {/* Render children if provided, otherwise fall back to linkText + icon */}
      {children ? children : (
        <>
          {linkText}
          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </Link>
  );
} 