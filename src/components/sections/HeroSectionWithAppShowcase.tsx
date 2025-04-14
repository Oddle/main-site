import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react"; // Import React for JSX typing if needed
import { useTranslations } from 'next-intl'; // Import useTranslations
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper
import Container from "@/components/common/Container"; // Import Container

// Define interfaces for the data structure
interface ImageProps {
  src: string;
  alt: string; // Will receive default English text
  width: number;
  height: number;
}

interface FeatureHighlightProps {
  icon: React.ReactNode; // Allow passing JSX for icons
  title: string; // Will receive default English text
  description: string; // Will receive default English text
  animationClass: string; // e.g., 'animate-float' or 'animate-float-slow'
}

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
  desktopImage: ImageProps;
  mobileImage: ImageProps;
  tabletImage: ImageProps;
  feature1: FeatureHighlightProps;
  feature2: FeatureHighlightProps;
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
  desktopImage,
  mobileImage,
  tabletImage,
  feature1,
  feature2,
  supportedPlatforms = defaultPlatforms, // Use default with keys
}: HeroSectionWithAppShowcaseProps) {
  const t = useTranslations(); // Initialize hook

  // Translate props using the imported helper function
  const badgeText = getTranslation(t, `${i18nBaseKey}.badge`, defaultBadgeText);
  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = getTranslation(t, `${i18nBaseKey}.description`, defaultDescription);
  
  const desktopAlt = getTranslation(t, `${i18nBaseKey}.desktopImageAlt`, desktopImage.alt);
  const mobileAlt = getTranslation(t, `${i18nBaseKey}.mobileImageAlt`, mobileImage.alt);
  const tabletAlt = getTranslation(t, `${i18nBaseKey}.tabletImageAlt`, tabletImage.alt);

  const feature1Title = getTranslation(t, `${i18nBaseKey}.featureIntegrated.title`, feature1.title);
  const feature1Desc = getTranslation(t, `${i18nBaseKey}.featureIntegrated.description`, feature1.description);
  const feature2Title = getTranslation(t, `${i18nBaseKey}.featureCustomizable.title`, feature2.title);
  const feature2Desc = getTranslation(t, `${i18nBaseKey}.featureCustomizable.description`, feature2.description);

  // Translate platform names using imported helper
  const translatedPlatforms = supportedPlatforms.map(platform => ({
    ...platform,
    name: getTranslation(t, `${i18nBaseKey}.${platform.translationKey}`, platform.name)
  }));

  return (
    <>
      {/* Hero */}
      <div className="py-24 lg:py-32">
         <Container>
            <div className="relative">
              <div className="text-center max-w-3xl mx-auto mb-16">
                {badgeText && (
                  <Badge variant="outline" className="mb-4">
                    {/* Use translated badgeText */} 
                    {badgeText}
                  </Badge>
                )}
                {title && (
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    {/* Use translated title */} 
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-xl text-muted-foreground mb-8">
                    {/* Use translated description */} 
                    {description}
                  </p>
                )}
                {/* Buttons removed as requested */}

                {/* Platform Support - Render dynamically translated platforms */}
                {translatedPlatforms.length > 0 && (
                  <div className="flex items-center justify-center gap-8 text-muted-foreground">
                    {translatedPlatforms.map((platform) => (
                      <div className="flex items-center gap-2" key={platform.translationKey}> {/* Use translationKey for React key */}
                        {platform.icon}
                        {/* Use translated platform name */} 
                        <span className="text-sm">{platform.name}</span> 
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Device Showcase */}
              <div className="relative max-w-5xl mx-auto">
                {/* Desktop */}
                {desktopImage && (
                    <Card className="overflow-hidden border-2 shadow-2xl">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b">
                        <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                    </div>
                    <div className="aspect-[16/9] bg-muted">
                        <Image
                        src={desktopImage.src}
                        alt={desktopAlt}
                        width={desktopImage.width}
                        height={desktopImage.height}
                        className="w-full h-full object-cover"
                        priority // Add priority if it's the LCP image
                        />
                    </div>
                    </Card>
                )}

                {/* Mobile */}
                {mobileImage && (
                    <Card className="absolute -right-8 top-1/2 w-72 overflow-hidden border-2 shadow-2xl">
                    <div className="flex items-center justify-center py-3 bg-muted border-b">
                        <div className="w-16 h-4 rounded-full bg-muted-foreground/20" />
                    </div>
                    <div className="aspect-[9/16] bg-muted">
                        <Image
                        src={mobileImage.src}
                        alt={mobileAlt}
                        width={mobileImage.width}
                        height={mobileImage.height}
                        className="w-full h-full object-cover"
                        />
                    </div>
                    </Card>
                )}

                {/* Tablet */}
                {tabletImage && (
                    <Card className="absolute -left-8 top-1/4 w-80 overflow-hidden border-2 shadow-2xl rotate-[-8deg]">
                    <div className="aspect-[4/3] bg-muted">
                        <Image
                        src={tabletImage.src}
                        alt={tabletAlt}
                        width={tabletImage.width}
                        height={tabletImage.height}
                        className="w-full h-full object-cover"
                        />
                    </div>
                    </Card>
                )}

                {/* Feature Highlights */}
                {feature1 && (
                  <div className="absolute top-0 right-0 flex gap-4">
                    <Card className={`p-4 w-48 ${feature1.animationClass}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {feature1.icon}
                        </div>
                        <p className="font-medium">{feature1Title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature1Desc}
                      </p>
                    </Card>
                  </div>
                )}

                {feature2 && (
                  <div className="absolute bottom-0 left-0 flex gap-4">
                    <Card className={`p-4 w-48 ${feature2.animationClass}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {feature2.icon}
                        </div>
                        <p className="font-medium">{feature2Title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature2Desc}
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </Container>
      </div>
      {/* End Hero */}
    </>
  );
} 