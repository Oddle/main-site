"use client";

import Image from 'next/image';
import Link from 'next/link'; // Use Next Link for internal links
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';

import { getTranslation } from '@/lib/i18nUtils';
import Container from '@/components/common/Container';

// Interface for individual feature items
interface FeatureItem {
  id: string; // Keep id for mapping keys
  title: string;
  description: string;
  imageSrc: string; // Renamed from image
  imageAlt: string; // Added alt text
}

// Interface for the component props
interface FeatureSectionHeroGridProps {
  i18nBaseKey: string;
  heading: string; // Default heading
  description: string; // Default description
  linkUrl?: string | null;
  linkText?: string | null;
  features?: FeatureItem[]; // Make features optional, handle empty/null case
}

const FeatureSectionHeroGrid = ({
  i18nBaseKey,
  heading: defaultHeading,
  description: defaultDescription,
  linkUrl,
  linkText: defaultLinkText,
  features = [], // Default to empty array
}: FeatureSectionHeroGridProps) => {
  const t = useTranslations();

  // Translate props
  const heading = getTranslation(t, `${i18nBaseKey}.heading`, defaultHeading);
  const description = getTranslation(t, `${i18nBaseKey}.description`, defaultDescription);
  const linkText = defaultLinkText ? getTranslation(t, `${i18nBaseKey}.linkText`, defaultLinkText) : null;

  // Handle case with no features
  if (!features || features.length === 0) {
    // Decide how to render - maybe just the header? Or null?
    // For now, let's render header if provided, otherwise null
    if (!heading && !description) return null;
  }

  const firstFeature = features[0];
  const remainingFeatures = features.slice(1);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container> {/* Use project's Container */}
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20"> {/* Adjusted gaps */}

          {/* Header */}
          <div className="lg:max-w-md xl:max-w-lg"> {/* Constrained width */}
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:mb-4 lg:mb-6">
              {heading}
            </h2>
            <p className="mb-6 text-base text-muted-foreground lg:mb-8 lg:text-lg">{description}</p>
            {linkUrl && linkText && (
              <Link
                href={linkUrl}
                className="group inline-flex items-center text-base font-medium text-primary hover:text-primary/80" // Use primary color
              >
                {linkText}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Grid */}
          {features.length > 0 && (
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
               {/* First Feature (Spans 2 columns) */}
               {firstFeature && (
                 <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card dark:bg-slate-800/50 shadow-sm md:col-span-2 md:grid md:grid-cols-2 md:gap-0"> {/* Added bg/shadow, removed internal gap */}
                   <div className="relative md:min-h-[24rem] lg:min-h-[28rem] xl:min-h-[32rem]">
                     <Image
                       src={firstFeature.imageSrc}
                       alt={getTranslation(t, `${i18nBaseKey}.features.0.imageAlt`, firstFeature.imageAlt)}
                       fill
                       className="aspect-[16/9] h-full w-full object-cover object-center md:aspect-auto" // aspect only on mobile
                       sizes="(max-width: 768px) 100vw, 50vw"
                     />
                   </div>
                   <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                     <h3 className="mb-3 text-xl font-semibold md:mb-4 md:text-2xl lg:mb-6">
                       {getTranslation(t, `${i18nBaseKey}.features.0.title`, firstFeature.title)}
                     </h3>
                     <p className="text-base text-muted-foreground lg:text-lg">
                       {getTranslation(t, `${i18nBaseKey}.features.0.description`, firstFeature.description)}
                     </p>
                   </div>
                 </div>
               )}

              {/* Remaining Features */}
               {remainingFeatures.map((feature, index) => (
                 <div
                   key={feature.id}
                   className="flex flex-col overflow-hidden rounded-xl border border-border bg-card dark:bg-slate-800/50 shadow-sm" // Added bg/shadow
                 >
                   <div className="relative aspect-video w-full"> {/* Container for image */}
                     <Image
                       src={feature.imageSrc}
                       alt={getTranslation(t, `${i18nBaseKey}.features.${index + 1}.imageAlt`, feature.imageAlt)}
                       fill
                       className="object-cover object-center"
                       sizes="(max-width: 768px) 100vw, 50vw" // Span full width on mobile, half on md+
                     />
                   </div>
                   <div className="flex flex-grow flex-col p-6 md:p-8 lg:p-10"> {/* Use flex-grow for consistent height */} 
                     <h3 className="mb-3 text-xl font-semibold md:mb-4 md:text-2xl lg:mb-6">
                       {getTranslation(t, `${i18nBaseKey}.features.${index + 1}.title`, feature.title)}
                     </h3>
                     <p className="text-base text-muted-foreground lg:text-lg">
                       {getTranslation(t, `${i18nBaseKey}.features.${index + 1}.description`, feature.description)}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
          )}
         </div>
       </Container>
     </section>
   );
 };

 export default FeatureSectionHeroGrid; 