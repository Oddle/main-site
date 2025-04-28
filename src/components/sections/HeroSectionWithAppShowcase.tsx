import { Badge } from "@/components/ui/badge";
// Card imports might not be needed anymore unless used for the image container
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; 
import Image from "next/image";
import React from "react"; // Removed useRef import
import { useTranslations } from 'next-intl'; // Import useTranslations
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper
import Container from "@/components/common/Container"; // Import Container
import { Marquee } from "@/components/magicui/marquee"; // Import Marquee

// Define interfaces for the data structure
interface ImageProps {
  src: string;
  alt: string; // Will receive default English text
  width: number;
  height: number;
}

// Removed FeatureHighlightProps

interface PlatformProps {
  icon: React.ReactNode;
  name: string; // Receives default English name ("Desktop", "Mobile", "Web")
  translationKey: string; // e.g., "platformDesktop"
}

interface HeroSectionWithAppShowcaseProps {
  i18nBaseKey: string; // Added base key
  badgeText: string; // Default English text
  title: string; // Default English text
  description: string; // Default English text
  images: ImageProps[]; // Changed from desktopImage/mobileImage to images array
  supportedPlatforms?: PlatformProps[]; // Made optional or ensure default value
}

// Define default icons if not passed via props (optional, but can be useful)
const defaultDesktopIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const defaultMobileIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);

const defaultWebIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" />
  </svg>
);

// Default platforms including translation keys
const defaultPlatforms: PlatformProps[] = [
  { icon: defaultDesktopIcon, name: "Desktop", translationKey: "platformDesktop" },
  { icon: defaultMobileIcon, name: "Mobile", translationKey: "platformMobile" },
  { icon: defaultWebIcon, name: "Web", translationKey: "platformWeb" },
];

export default function HeroSectionWithAppShowcase({
  i18nBaseKey, // Destructure base key
  badgeText: defaultBadgeText,
  title: defaultTitle,
  description: defaultDescription,
  images, // Use images array prop
  supportedPlatforms = defaultPlatforms, // Use default with keys
}: HeroSectionWithAppShowcaseProps) {
  const t = useTranslations(); // Initialize hook

  // Translate props using the imported helper function
  const badgeText = getTranslation(t, `${i18nBaseKey}.badge`, defaultBadgeText);
  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = getTranslation(t, `${i18nBaseKey}.description`, defaultDescription);
  
  // Removed desktopAlt/mobileAlt translations

  // Translate platform names using imported helper
  const translatedPlatforms = supportedPlatforms.map(platform => ({
    ...platform,
    name: getTranslation(t, `${i18nBaseKey}.${platform.translationKey}`, platform.name)
  }));

  // Removed tab name translations

  // Pre-render the image elements for the Marquee using the images prop
  // Adopt pattern from FeatureSectionWithGridImages
  const marqueeContent = images.map((img, index) => {
    // Calculate aspect ratio for the container div
    const aspectRatio = img.width / img.height;
    const displayHeight = 380; // Container height

    return (
      // Wrapper div: needs relative, fixed height, defined aspect ratio, overflow hidden
      <div 
        key={index} 
        className={`relative h-[380px] rounded-lg overflow-hidden shadow-lg bg-muted/50 shrink-0`}
        style={{ aspectRatio: `${aspectRatio}` }} // Set aspect ratio for the container
      >
        <Image
          src={img.src} 
          alt={img.alt} 
          fill // Use fill prop
          className="absolute inset-0 size-full object-cover p-1 rounded-lg" // Added rounded-lg
          sizes="(max-width: 768px) 50vw, 33vw" 
          // Removed explicit width/height
        />
      </div>
    );
  });

  return (
    <>
      {/* Hero */}
      <div className="py-16 md:py-24 relative z-10 bg-[#2F0083]">
         <Container>
          {/* Header Content */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            {badgeText && (
              <Badge variant="outline" className="mb-4 text-white border-white/30">
                {badgeText}
              </Badge>
            )}
            {title && (
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-xl text-white/90 mb-8">
                {description}
              </p>
            )}
            {translatedPlatforms.length > 0 && (
              <div className="flex items-center justify-center gap-8 text-purple-200">
                {translatedPlatforms.map((platform) => (
                  <div className="flex items-center gap-2" key={platform.translationKey}> 
                    {platform.icon}
                    <span className="text-sm">{platform.name}</span> 
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Marquee Showcase */} 
          <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg"> 
            {/* Apply gap using the Marquee's CSS variable */}
            <Marquee pauseOnHover className="[--duration:15s] [--gap:1.5rem]">
              {marqueeContent} 
            </Marquee>
            {/* Fade effect for edges - Updated color */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#2F0083]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#2F0083]"></div>
          </div>

          {/* Removed Feature Highlights Section */}

        </Container>
      </div>
    </>
  );
} 