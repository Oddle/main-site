import Image from 'next/image';
import { Cpu, Lock, Sparkles, Zap, Headset, Clock, Wifi, Mail, Repeat, Star, Database, BarChart, Shuffle, CreditCard, HandCoins, MailCheck, Edit, Replace } from 'lucide-react';
import { FC } from 'react';
import Container from "@/components/common/Container";
import { useTranslations } from 'use-intl';
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper
import { Badge } from "@/components/ui/badge";
// Map icon names to actual components
const iconMap: { [key: string]: FC<React.SVGProps<SVGSVGElement>> } = {
  Cpu,
  Lock,
  Sparkles,
  Zap,
  Headset,
  Clock,
  Wifi,
  Mail,
  Repeat,
  Star,
  Database,
  BarChart,
  Shuffle,
  CreditCard,
  HandCoins,
  MailCheck,
  Edit,
  Replace,
  // Add other icons from lucide-react as needed
};

// Interface for individual feature points (items)
interface StandardItemData {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
}

// Optional image properties structure
interface ImageProps {
  lightSrc: string;
  darkSrc?: string;
  alt: string;
  position?: 'left' | 'right'; // Keep position if needed for layout
}

// Standardized props interface
interface FeatureSectionWithSubpointsProps {
  i18nBaseKey?: string;
  tag?: string | null;
  title: string; // Make required
  description?: string | null;
  image?: ImageProps; // Consolidated image object
  items: StandardItemData[]; // Make required
}

const FeatureSectionWithSubpoints: FC<FeatureSectionWithSubpointsProps> = ({
  i18nBaseKey,
  tag: defaultTag,
  title: defaultTitle,
  description: defaultDescription,
  items, // Now required, no default needed
  image, // Use the new image object
}) => {
  const t = useTranslations();

  // Translate using shared helper
  const tag = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.tag`, defaultTag ?? '') : defaultTag;
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;
  const description = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription ?? '') : defaultDescription;
  const imageAlt = image ? (i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.image.alt`, image.alt) : image.alt) : 'Feature image'; // Translate alt from image object

  // Determine image sources from the image object
  const lightImage = image?.lightSrc;
  const darkImage = image?.darkSrc || lightImage; // Fallback dark to light if not provided

  const translatedItems = items.map((item, index) => {
    const itemBaseKey = `${i18nBaseKey}.items.${index}`;
    return {
      ...item,
      // Use shared getTranslation
      title: i18nBaseKey ? getTranslation(t, `${itemBaseKey}.title`, item.title) : item.title,
      description: i18nBaseKey ? getTranslation(t, `${itemBaseKey}.description`, item.description) : item.description,
      icon: item.icon,
    };
  });

  return (
    <section className="py-16 md:py-32">
      <Container>
        <div className="space-y-12">
          {/* Top Text Section */}
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
            {/* Left side (or top on mobile) - Title and Tag */} 
            <div> 
              {tag && (
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm"
                >                  {tag}
                </Badge>
              )}
              {title && (
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {title} {/* Use new prop */}
                </h2>
              )}
            </div>
            {/* Right side (or below on mobile) - Description */} 
            {description && (
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 md:ml-auto md:max-w-sm">
                {description} {/* Use new prop */}
              </p>
            )}
          </div>

          {/* Image Section - Updated to use image object */}
          {image && (
             <div className="relative rounded-2xl md:-mx-8">
              {/* TODO: Implement imagePosition logic if needed */}
              <div className="relative aspect-[88/36] w-full overflow-hidden rounded-2xl">
                {darkImage && (
                  <Image
                    src={darkImage}
                    alt={imageAlt} // Use translated alt
                    fill
                    className="hidden object-cover dark:block"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw"
                  />
                )}
                {lightImage && (
                  <Image
                    src={lightImage}
                    alt={imageAlt} // Use translated alt
                    fill
                    className="block object-cover dark:hidden"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw"
                  />
                )}
              </div>
            </div>
          )}

          {/* Items Grid Section - Use items */}
          {/* No need to check items.length > 0 as it's required */}
          <div className="relative mx-auto grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {translatedItems.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              // Remove itemBaseKey definition as it's already used above for translation

              // Use already translated item properties
              const itemTitle = item.title;
              const itemDescription = item.description;

              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3">
                    {IconComponent && (
                      <IconComponent className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                    )}
                    {item.title && (
                      <h3 className="text-lg font-semibold dark:text-white">
                        {itemTitle} {/* Already translated */}
                      </h3>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-base text-muted-foreground">
                      {itemDescription} {/* Already translated */}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeatureSectionWithSubpoints;