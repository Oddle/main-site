import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';
import Container from '@/components/common/Container';
import Link from 'next/link';

// Interface for a single grid item
interface GridItem {
  title: string; // Default title
  description: string; // Default description
  image: {
    src: string;
    alt: string; // Default alt text
  };
  href?: string | null; // Optional link field
}

// Component props
interface FeatureSectionWithGridImagesProps {
  i18nBaseKey: string; // e.g., "home.featureGrid"
  title: string; // Default section title
  description?: string | null; // Optional section description
  items: GridItem[]; // Array of grid items
}

export default function FeatureSectionWithGridImages({
  i18nBaseKey,
  title: defaultTitle,
  description: defaultDescription,
  items,
}: FeatureSectionWithGridImagesProps) {
  const t = useTranslations();

  // Translate section title and description
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;
  const description = i18nBaseKey && defaultDescription ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription) : defaultDescription;

  // Determine grid classes based on item count
  const gridClasses = items.length === 4
    ? "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8" // 1 col on mobile, 2x2 grid on sm+
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"; // Default responsive grid

  return (
    <Container className="py-16 md:py-24 lg:py-32 relative z-30 bg-background">
      {/* Section Header */} 
      <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Items Grid - Updated structure and styling */}
      <div className={gridClasses}> {/* Use dynamically determined classes */}
        {items.map((item, index) => {
          // Get default values from item prop
          const defaultTitle = item.title;
          const defaultDescription = item.description;
          const defaultAlt = item.image.alt || defaultTitle; // Use item title as fallback alt
          const defaultHref = item.href; // Get default href from props

          // Translate item fields
          const itemTitle = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${index}.title`, defaultTitle) : defaultTitle;
          const itemDescription = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${index}.description`, defaultDescription) : defaultDescription;
          const itemAlt = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${index}.image.alt`, defaultAlt) : defaultAlt;
          // Get localized href, falling back to the default href from props
          const itemHref = defaultHref && i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.items.${index}.href`, defaultHref) : defaultHref;

          // Card content defined once
          const cardContent = (
            <div 
              className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-1 block"
            >
              {/* Background Image */}
              <Image
                src={item.image.src}
                alt={itemAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="absolute inset-0 -z-20 size-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/50 to-transparent" />
              {/* Content Overlay */}
              <div className="flex h-full flex-col justify-end p-6 text-background">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-1">{itemTitle}</h3>
                    <p className="text-sm text-background/80 line-clamp-2">{itemDescription}</p>
                  </div>
              </div>
            </div>
          );

          // Conditionally wrap with Link if localized href exists
          return itemHref ? (
            <Link key={index} href={itemHref} className="no-underline">
              {cardContent}
            </Link>
          ) : (
            <div key={index}>
              {cardContent}
            </div>
          );
        })}
      </div>
    </Container>
  );
} 