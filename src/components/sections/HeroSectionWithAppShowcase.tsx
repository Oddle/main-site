import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react"; // Import React for JSX typing if needed

// Define interfaces for the data structure
interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface FeatureHighlightProps {
  icon: React.ReactNode; // Allow passing JSX for icons
  title: string;
  description: string;
  animationClass: string; // e.g., 'animate-float' or 'animate-float-slow'
}

interface PlatformProps {
  icon: React.ReactNode;
  name: string;
}

interface HeroSectionWithAppShowcaseProps {
  badgeText: string;
  title: string;
  description: string;
  desktopImage: ImageProps;
  mobileImage: ImageProps;
  tabletImage: ImageProps;
  feature1: FeatureHighlightProps;
  feature2: FeatureHighlightProps;
  supportedPlatforms: PlatformProps[];
  // Removed primaryButton and secondaryButton props
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


export default function HeroSectionWithAppShowcase({
  badgeText,
  title,
  description,
  desktopImage,
  mobileImage,
  tabletImage,
  feature1,
  feature2,
  supportedPlatforms = [ // Provide default platforms or ensure they are passed
      { icon: defaultDesktopIcon, name: "Desktop" },
      { icon: defaultMobileIcon, name: "Mobile" },
      { icon: defaultWebIcon, name: "Web" },
  ],
}: HeroSectionWithAppShowcaseProps) {
  return (
    <>
      {/* Hero */}
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        <div className="relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {badgeText && (
              <Badge variant="outline" className="mb-4">
                {badgeText}
              </Badge>
            )}
            {title && (
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-xl text-muted-foreground mb-8">
                {description}
              </p>
            )}
            {/* Buttons removed as requested */}

            {/* Platform Support - Rendered dynamically */}
            {supportedPlatforms.length > 0 && (
              <div className="flex items-center justify-center gap-8 text-muted-foreground">
                {supportedPlatforms.map((platform) => (
                  <div className="flex items-center gap-2" key={platform.name}>
                    {platform.icon}
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
                    alt={desktopImage.alt}
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
                    alt={mobileImage.alt}
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
                    alt={tabletImage.alt}
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
                    <p className="font-medium">{feature1.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature1.description}
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
                    <p className="font-medium">{feature2.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature2.description}
                  </p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
} 