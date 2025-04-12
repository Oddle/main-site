import Link from "next/link";
// Add back needed icons
import {
  FacebookIcon,
  LinkedinIcon,
} from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
// Import and type commonData
import commonJson from "@/data/common.json";
import globalContent from "@/data/globalContent.json";

// --- Interfaces for FINAL Data Structures Used in Component ---
interface FooterLink {
  label: string; // Translation key
  href: string;  // Looked up from common.json
  external?: boolean; // Potentially looked up or assumed
}

interface FooterLinkSection {
  title: string; // Translation key
  links: FooterLink[]; // Array of fully processed links
}

interface SocialLink {
  name: string; // Actual name (e.g., "Facebook") looked up for icon/aria
  href: string; // Looked up from common.json
}

// --- Interfaces reflecting RAW data from JSON ---
interface RawFooterLink {
  label: string; // Translation key
}

interface RawFooterLinkSection {
  title: string; // Translation key
  links: RawFooterLink[];
}

interface RawSocialLink {
    label: string; // Translation key (e.g., "facebook")
}

interface FooterData {
  linkSections?: RawFooterLinkSection[];
  socialLinks?: RawSocialLink[];
  copyright?: string; // Translation key
}

interface AddressData {
  entityName?: string;
  country: string;
  address: string;
}

interface ProductData {
  name: string; // Actual Name (used for display, maybe lookup)
  description?: string;
  href: string;
  category?: string;
}

// Interface for the general links in common.json
interface CommonLinkData {
    name: string; // Used for lookup matching label from globalContent
    description?: string;
    href: string;
}

// --- Interface for the overall common.json structure ---
interface CommonData {
    products?: { [key: string]: ProductData };
    addresses?: { [key: string]: AddressData };
    links?: { [key: string]: CommonLinkData };
}

// Type the imported common data
const commonData: CommonData = commonJson;

// Remove hardcoded socialLinks
// const socialLinks: SocialLink[] = [ ... ];

const socialIconMap: { [key: string]: React.ElementType } = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedinIcon,
};

// --- Component Implementation ---
export default function Footer() {
  const tFooter = useTranslations("footer");
  const tProducts = useTranslations("products");
  const tCommon = useTranslations("common");

  // --- Extract Addresses from commonData ---
  const addresses: { [key: string]: AddressData } = commonData.addresses || {};

  // --- Extract RAW Footer Structure from globalContent ---
  const globalFooterData: FooterData = globalContent.footer || {};
  const rawLinkSections = globalFooterData.linkSections || [];
  const rawSocialLinks = globalFooterData.socialLinks || [];
  const copyrightKey = "copyright";

  // --- Create Lookups from common.json ---

  // 1. Product Lookup (label -> href)
  const productHrefMap = Object.entries(commonData.products || {}).reduce(
    (map: { [key: string]: string }, [key, product]) => {
        map[key] = product.href;
        return map;
    },
    {}
  );

  // 2. General Links Lookup (label -> href)
  const generalLinkHrefMap = Object.values(commonData.links || {}).reduce(
      (map: { [key: string]: string }, link: CommonLinkData) => {
          // Assume labels in globalContent are lowercase with hyphens
          const key = link.name.toLowerCase().replace(/\s+/g, '-');
          map[key] = link.href;
          return map;
      },
      {}
  );
  // Combine product and general link lookups
  const allLinkHrefMap = { ...generalLinkHrefMap, ...productHrefMap }; 

  // 3. Social Links Lookup (label -> { name: string, href: string })
  const socialLinkDetailsMap = Object.values(commonData.links || {}).reduce(
      (map: { [key: string]: { name: string, href: string } }, link: CommonLinkData) => {
          const lowerCaseKey = link.name.toLowerCase().replace(/\s+/g, '-');
          // Use the generated key (expected to match labels like "facebook")
          if (lowerCaseKey === 'facebook' || lowerCaseKey === 'linkedin') {
             map[lowerCaseKey] = { name: link.name, href: link.href }; // Store Original Name and href
          }
          return map;
      },
      {}
  );


  // --- Process RAW Link Sections into FINAL Link Sections ---
  const allLinkSections: FooterLinkSection[] = rawLinkSections.map((section) => ({
    title: section.title,
    links: section.links.map((link) => ({
      label: link.label,
      href: allLinkHrefMap[link.label] || '#',
      external: allLinkHrefMap[link.label]?.startsWith('http') ?? false,
    })),
  }));

  // --- Process RAW Social Links into FINAL Social Links ---
  const finalSocialLinks: SocialLink[] = rawSocialLinks
    .map((link) => socialLinkDetailsMap[link.label]) // Lookup by label (e.g., "facebook")
    .filter((details): details is { name: string; href: string } => !!details);


  // --- Define Company Info ---
  const companyName = "Oddle";
  const companySlogan = "The best restaurant revenue growth partner with delivery, reservation, loyalty, and marketing";

  // --- Process Copyright ---
  const currentYear = new Date().getFullYear();
  const copyrightText = tFooter(copyrightKey, {
    currentYear: currentYear.toString(),
    companyName: companyName,
  });

  // --- Define Policy Links for Bottom Row (using translation keys) ---
  const bottomPrivacyPolicyLink: FooterLink = {
    label: "privacy-policy",
    href: allLinkHrefMap["privacy-policy"] || "/privacy"
  };
  const bottomTermsOfServiceLink: FooterLink = {
    label: "terms-of-service",
    href: allLinkHrefMap["terms-of-service"] || "/terms"
  };

  return (
    <footer className="w-full bg-background pt-12 md:pt-16 lg:pt-20 text-sm">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        {/* Top Section: Logo/Slogan ONLY */}
        <div className="pb-8 md:pb-12">
          {/* Logo & Slogan */}
          <div className="mb-6 md:mb-8">
            <Link href="/" className="inline-block mb-3">
              <span className="font-bold text-2xl">{companyName}</span>
            </Link>
            <p className="text-muted-foreground ">
              {companySlogan}
            </p>
          </div>
        </div>

        {/* Link Sections moved below Logo/Slogan */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-12 md:pb-16 lg:pb-20">
          {allLinkSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="font-medium mb-4">{tFooter(section.title)}</h3>
              <ul className="space-y-2">
                {section.links.map((link: FooterLink) => {
                  // Determine the correct translation key and function based on the link label
                  let translationKey = link.label;
                  let translateFunc = tFooter; // Default to footer translations

                  // Explicit mapping for common links based on their label from globalContent.json
                  const commonKeyMap: { [key: string]: string } = {
                      'privacy-policy': 'Privacy Policy',
                      'terms-of-service': 'Terms of Service',
                      'contact-us': 'Contact Us',
                      'about-us': 'About Us'
                  };

                  if (productHrefMap.hasOwnProperty(link.label)) {
                    // It's a product link, use tProducts with the title subkey
                    translationKey = `${link.label}.title`;
                    translateFunc = tProducts;
                  } else if (commonKeyMap[link.label]) {
                    // It's a known common link, use tCommon with the mapped key
                    translationKey = commonKeyMap[link.label];
                    translateFunc = tCommon;
                  }
                  // Otherwise, use the default (tFooter with link.label)

                  // Perform the translation
                  const translatedLabel = translateFunc(translationKey);

                  return (
                    <li key={link.label}> {/* Use label as key */}
                      {link.external ? (
                        <a
                          href={link.href} // Use processed href
                          className="text-muted-foreground transition-colors hover:text-foreground"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {translatedLabel} {/* Use the determined translation */}
                        </a>
                      ) : (
                        <Link
                          href={link.href} // Use processed href
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {translatedLabel} {/* Use the determined translation */}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Section: Separator + Addresses */}
        <div className="border-t pt-8 pb-12 md:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(addresses).map(([key, addr]) => (
              <div key={key}>
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{addr.country}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {addr.entityName && <span className="block">{addr.entityName}</span>}
                  {addr.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Added Bottom Row: Separator + Social/Copyright/Policy */}        
        <div className="border-t pt-8 pb-8">          
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">            
            {/* Social Links (using final processed data) */}            
            <div className="flex gap-4 order-1 md:order-1">              
              {finalSocialLinks.map((link: SocialLink) => {
                const IconComponent = socialIconMap[link.name]; // Use looked-up name for icon
                const translatedAriaLabel = tFooter(link.name); // Translate the looked-up Name (e.g., "Facebook") using tFooter
                return IconComponent ? (
                  <a
                    key={link.name}
                    href={link.href} // Use looked-up href
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={translatedAriaLabel}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                ) : null;
              })}
            </div>

            {/* Copyright (using processed text) */}            
            <div className="text-xs text-muted-foreground order-3 md:order-2">              
              {copyrightText}
            </div>

            {/* Policy Links (Bottom Row) */}            
            <div className="flex gap-4 order-2 md:order-3">              
              {/* Render Privacy Policy */}
              <Link
                href={bottomPrivacyPolicyLink.href} // Use looked-up href
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {tCommon('Privacy Policy')} {/* Explicitly use tCommon */}
              </Link>
              {/* Render Terms of Service */}
              <Link
                href={bottomTermsOfServiceLink.href} // Use looked-up href
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {tCommon('Terms of Service')} {/* Explicitly use tCommon */}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
} 