"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';
import * as Icons from 'lucide-react'; // Import all lucide icons for dynamic rendering
import Container from '@/components/common/Container'; // Import Container
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card"; // Import NeonGradientCard
import { Badge } from "@/components/ui/badge"; // Import Badge

// --- Define Prop Types ---

// Define the shape of a single feature item
interface FeatureItem {
  icon: keyof typeof Icons; // Use keyof typeof Icons for type safety
  title: string;           // Default title
  description: string;   // Default description
}

// Define the shape of the image data
interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Define the component's props according to the reusable pattern
interface FeatureSectionProps {
  i18nBaseKey: string;          // Required: Base key for translations
  tag?: string | null;         // Optional: Tag/badge text
  title: string;              // Required: Default title
  description: string;        // Required: Default description
  image: ImageProps;          // Required: Image object
  features: FeatureItem[];    // Required: Array of feature items
}

// --- Icon Map (Type assertion for dynamic icon rendering) ---
const IconMap = Icons as unknown as { [key: string]: React.ComponentType<{ className?: string }> };

// --- Component Implementation ---

export default function FeatureSectionOverlapImage({
  i18nBaseKey,
  tag: defaultTag,
  title: defaultTitle,
  description: defaultDescription,
  image: defaultImage,
  features: defaultFeatures,
}: FeatureSectionProps) {
  const t = useTranslations(); // Initialize i18n hook

  // Translate text props using the base key and defaults
  const tag = defaultTag ? getTranslation(t, `${i18nBaseKey}.tag`, defaultTag) : null;
  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = getTranslation(t, `${i18nBaseKey}.description`, defaultDescription);
  const imageAlt = getTranslation(t, `${i18nBaseKey}.image.alt`, defaultImage.alt);

  // Translate features array
  const features = defaultFeatures.map((feature, index) => ({
    icon: feature.icon,
    title: getTranslation(t, `${i18nBaseKey}.features.${index}.title`, feature.title),
    description: getTranslation(t, `${i18nBaseKey}.features.${index}.description`, feature.description),
  }));

  return (
    <section className="py-16 md:py-32">
      {/* Wrap content in Container */}
      <Container>
        <div className="space-y-8 md:space-y-12"> {/* Removed mx-auto, max-w-*, px-* */}
          {/* Centered Title and Description */}
          <div className="mx-auto max-w-xl space-y-4 text-center md:space-y-6"> {/* Adjusted spacing */}
            {/* Render tag if it exists */}
            {tag && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm"
              >
                {tag}
              </Badge>
            )}
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="text-muted-foreground md:text-lg/relaxed">{description}</p>
          </div>

          {/* Image Wrapper with NeonGradientCard */}
          <NeonGradientCard 
            className="mx-auto w-full max-w-3xl" 
            borderRadius={12} // Set border radius (corresponds to rounded-xl)
            borderSize={2} // Added borderSize prop
          >
            {/* Removed border and overflow-hidden, added rounded-xl */}
            <div className={`w-full h-[${defaultImage.height}px] relative rounded-xl`}> 
              <Image 
                className="rounded-xl w-full h-full object-contain" // Match border radius, fill wrapper, contain image
                src={defaultImage.src}
                alt={imageAlt} 
                width={defaultImage.width} 
                height={defaultImage.height}
                loading="lazy" 
              />
            </div>
          </NeonGradientCard>

          {/* Features Grid */}
          <div className="relative mx-auto grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {features.map((feature, index) => {
              const IconComponent = IconMap[feature.icon];
              return (
                <div key={index} className="space-y-2"> {/* Use space-y-2 consistently */}
                  <div className="flex items-center gap-2">
                    {IconComponent ? <IconComponent className="size-4 flex-shrink-0" /> : <Icons.HelpCircle className="size-4 flex-shrink-0" />} {/* Fallback Icon */}
                    <h3 className="text-sm font-medium">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
} 