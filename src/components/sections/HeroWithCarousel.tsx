import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import React from "react";
import clsx from "clsx";
import { icons } from "lucide-react";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';
import Container from "@/components/common/Container";
import Image from "next/image";
import InlineCustomerLogos from "../common/InlineCustomerLogos";

interface SlideData {
  imageSrc: string;
  imageAlt: string;
}

interface ButtonData {
  text: string;
  action: string;
  icon?: string;
}

interface HeroWithCarouselProps {
  i18nBaseKey: string;
  reverseMobileLayout?: boolean;
  title: string;
  description: string;
  primaryButton: ButtonData;
  secondaryButton?: ButtonData;
  slides: SlideData[];
  locale: string;
}

export default function HeroWithCarousel({
  i18nBaseKey,
  reverseMobileLayout = false,
  title: defaultTitle,
  description: defaultDescription,
  primaryButton,
  secondaryButton,
  slides = [],
  locale,
}: HeroWithCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  const t = useTranslations();

  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = getTranslation(t, `${i18nBaseKey}.description`, defaultDescription);
  const primaryButtonText = getTranslation(t, `${i18nBaseKey}.primaryButton.text`, primaryButton.text);
  const secondaryButtonText = secondaryButton
    ? getTranslation(t, `${i18nBaseKey}.secondaryButton.text`, secondaryButton.text)
    : undefined;

  const handleButtonClick = (action: string) => {
    if (action.startsWith('/')) {
      window.location.href = action;
    } else {
      console.log('Button action:', action);
    }
  };

  const renderIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    const LucideIcon = icons[iconName as keyof typeof icons];
    if (!LucideIcon) {
      console.warn(`Icon "${iconName}" not found in lucide-react`);
      return null;
    }
    return <LucideIcon className="mr-2 h-4 w-4" />;
  };

  return (
    <>
      {/* Hero */}
      <div className="pt-8 pb-24 lg:pt-32 lg:pb-32">
        <Container>
          {/* Grid */}
          <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
            <div className={clsx(
              "lg:col-span-3",
              reverseMobileLayout ? "order-2 lg:order-1 mt-10 lg:mt-0" : "order-1"
            )}>
              {title && (
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-3 text-xl text-muted-foreground">
                  {description}
                </p>
              )}
              <div className="mt-5 lg:mt-8 flex flex-col sm:items-center gap-2 sm:flex-row sm:gap-3">
                <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                  {primaryButton?.text && (
                    <Button size={"lg"} className="cursor-pointer" onClick={() => handleButtonClick(primaryButton.action)}>
                      {renderIcon(primaryButton.icon)}
                      {primaryButtonText}
                    </Button>
                  )}
                  {secondaryButton?.text && secondaryButtonText && (
                    <Button variant={"outline"} size={"lg"} className="cursor-pointer" onClick={() => handleButtonClick(secondaryButton.action)}>
                      {renderIcon(secondaryButton.icon)}
                      {secondaryButtonText}
                    </Button>
                  )}
                </div>
              </div>
              {/* Render Inline Customer Logos */}
              <InlineCustomerLogos locale={locale} i18nBaseKey="common.trustedBy" />
            </div>
            {/* End Col */}
            <div className={clsx(
              "lg:col-span-4",
              reverseMobileLayout ? "order-1" : "order-2 lg:order-2 mt-10 lg:mt-0"
            )}>
              {slides.length === 1 ? (
                (() => {
                  const slide = slides[0];
                  const slideImageAlt = getTranslation(t, `${i18nBaseKey}.slides.0.imageAlt`, slide.imageAlt);
                  return (
                    <Image
                      className="object-cover rounded-xl mx-auto block"
                      src={slide.imageSrc}
                      alt={slideImageAlt}
                      width={636}
                      height={636}
                      priority={true}
                      sizes="(max-width: 768px) 90vw, 636px"
                    />
                  );
                })()
              ) : (
                <Carousel
                  plugins={[plugin.current]}
                  className="w-full"
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                >
                  <CarouselContent>
                    {slides.map((slide, index) => {
                      const slideImageAlt = getTranslation(t, `${i18nBaseKey}.slides.${index}.imageAlt`, slide.imageAlt);
                      return (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                            <Image
                              className="object-cover"
                              src={slide.imageSrc}
                              alt={slideImageAlt}
                              fill
                              priority={index === 0}
                              sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
              )}
            </div>
            {/* End Col */}
          </div>
          {/* End Grid */}
        </Container>
      </div>
      {/* End Hero */}
    </>
  );
}
