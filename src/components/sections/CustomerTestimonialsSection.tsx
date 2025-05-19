import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';
import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Container from '@/components/common/Container';
import testimonialData from '@/data/testimonials.json';

interface TestimonialItem {
  name: string;
  role: string;
  restaurant: string;
  photo: {
    src: string;
    alt: string; // Default alt text from JSON can be used here if needed
  };
  quote: string; // Default quote
  onlineSales?: string | null;
  locations?: number | string | null;
  storyLink?: string | null;
  storyLinkText?: string | null; // Add optional text for button
}

interface TestimonialsData {
  [locale: string]: TestimonialItem[];
}

interface CustomerTestimonialsProps {
  locale: string;
  i18nBaseKey: string; // Should be "testimonials"
  title: string; // Default title (passed from pageSections)
  description?: string | null; // Default description (passed from pageSections)
}

export default function CustomerTestimonialsSection({
  locale,
  i18nBaseKey, // Still needed for section title/desc
  title: defaultTitle,
  description: defaultDescription,
}: CustomerTestimonialsProps) {
  // Use translations only for section title/description
  const t = useTranslations(); 
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;
  const description = i18nBaseKey && defaultDescription ? getTranslation(t, `${i18nBaseKey}.description`, defaultDescription) : defaultDescription;

  const allTestimonials = testimonialData as TestimonialsData;
  const items: TestimonialItem[] = allTestimonials[locale] || allTestimonials['en'] || [];

  // Labels - can be simplified as they aren't in the localized JSON anymore
  const onlineSalesLabel = "Online sales";
  const locationsLabel = "Locations";

  return (
    <Container className="py-12 md:py-16 lg:py-20">
      <div className="mb-8 md:mb-10 lg:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="max-w-xl text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-3 text-lg text-muted-foreground sm:mt-4">{description}</p>
          )}
        </div>
      </div>

      <div className="relative">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {items.map((item, index) => {
              // Assign data directly from item (already locale-specific)
              const name = item.name;
              const role = item.role;
              const restaurant = item.restaurant;
              const quote = item.quote;
              const photoAlt = item.photo.alt;
              const onlineSales = item.onlineSales;
              // Ensure locations is treated consistently (optional)
              const locations = item.locations ? String(item.locations) : null;
              const storyLink = item.storyLink;
              // Use specific button text or generate default
              const storyButtonText = item.storyLinkText || `See ${item.name}'s story`; 

              let mobilePhotoSrc = item.photo.src;
              let desktopPhotoSrc = item.photo.src;

              if (item.photo.src && item.photo.src.includes('ucarecdn.com/')) {
                const parts = item.photo.src.split('ucarecdn.com/');
                if (parts.length > 1) {
                  const pathAfterHost = parts[1];
                  if (pathAfterHost && !pathAfterHost.includes('/-/')) {
                    const baseWithSlash = pathAfterHost.endsWith('/') ? item.photo.src : item.photo.src + '/';
                    mobilePhotoSrc = `${baseWithSlash}-/scale_crop/256x256/smart/`;
                    desktopPhotoSrc = `${baseWithSlash}-/preview/1000x1000/-/format/auto/-/quality/smart/`;
                  }
                }
              }

              return (
                <CarouselItem key={index} className="pl-4 basis-full">
                  <Card className="h-full overflow-hidden border-none bg-transparent shadow-none">
                    <div className="md:grid md:grid-cols-5 md:items-center md:gap-10 lg:gap-16 bg-card p-6 md:p-8 lg:p-10 rounded-2xl border shadow-lg">
                      <div className="relative flex justify-center items-center mb-8 md:mb-0 md:col-span-2 md:block">
                        {/* Mobile Image */}
                        <Image
                          className="rounded-full w-32 h-32 object-cover block md:hidden"
                          src={mobilePhotoSrc} 
                          alt={photoAlt}
                          width={256} 
                          height={256}
                          priority={index === 0}
                        />
                        {/* Desktop Image */}
                        <Image
                          className="rounded-xl w-full h-auto md:max-h-[420px] object-cover hidden md:block"
                          src={desktopPhotoSrc}
                          alt={photoAlt}
                          width={1000} 
                          height={1000} 
                          priority={index === 0} // Apply priority to first item for desktop as well
                        />
                      </div>
                      <div className="md:col-span-3">
                        <blockquote className="relative">
                          <svg className="text-muted-foreground/10 absolute start-0 top-0 size-16 md:size-24 -translate-x-4 -translate-y-4 md:-translate-x-8 md:-translate-y-6 transform" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3Z" fill="currentColor"/>
                          </svg>
                          <div className="relative z-10">
                            <p className="text-xl font-medium italic md:text-2xl md:leading-normal">
                              &ldquo;{quote}&rdquo;
                            </p>
                          </div>
                          <footer className="mt-6">
                            <div className="flex items-center">
                              <div className="ms-4 md:ms-0">
                                <div className="text-base font-semibold">{name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {role}, {restaurant}
                                </div>
                              </div>
                            </div>
                          </footer>
                          {(onlineSales || locations) && (
                            <div className="flex items-center gap-6 md:gap-8 mt-6 border-t pt-6">
                              {onlineSales && (
                                <div>
                                  <p className="text-xl lg:text-2xl font-bold">{onlineSales}</p>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{onlineSalesLabel}</p>
                                </div>
                              )}
                              {locations && (
                                <div>
                                  <p className="text-xl lg:text-2xl font-bold">+{locations}</p>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{locationsLabel}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {storyLink && (
                            <div className="mt-6">
                              <Button asChild variant="outline" size="sm">
                                <Link href={storyLink}>
                                  {storyButtonText}
                                  <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                              </Button>
                            </div>
                          )}
                        </blockquote>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="hidden sm:flex justify-end gap-2 absolute -top-10 right-0 z-10">
             <CarouselPrevious className="static size-8 translate-x-0 translate-y-0" />
             <CarouselNext className="static size-8 translate-x-0 translate-y-0" />
          </div>
           <div className="sm:hidden mt-6 flex justify-center gap-3">
             <CarouselPrevious className="static size-10 translate-x-0 translate-y-0" />
             <CarouselNext className="static size-10 translate-x-0 translate-y-0" />
           </div>
        </Carousel>
      </div>
    </Container>
  );
} 