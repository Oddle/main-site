"use client"; // Ensure this is a client component

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import React from "react";
import clsx from "clsx";
import { MessageSquare } from "lucide-react";
import { useTranslations } from 'next-intl';
import { getTranslation } from '@/lib/i18nUtils';
import Container from "@/components/common/Container";
import Image from "next/image";
import InlineCustomerLogos from "../common/InlineCustomerLogos";
import Link from 'next/link';
import ChatRedirectLink from "@/components/common/ChatRedirectLink"; // Import the chat link

interface SlideData {
  imageSrc: string;
  imageAlt: string;
}

interface HeroWithCarouselProps {
  i18nBaseKey: string;
  reverseMobileLayout?: boolean;
  title: string;
  description: string;
  slides: SlideData[];
  locale: string;
}

export default function HeroWithCarousel({
  i18nBaseKey,
  reverseMobileLayout = false,
  title: defaultTitle,
  description: defaultDescription,
  slides = [],
  locale,
}: HeroWithCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  const t = useTranslations();
  const tCommon = useTranslations('common.buttons');

  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const description = getTranslation(t, `${i18nBaseKey}.description`, defaultDescription);

  return (
    <>
      {/* Hero */}
      <div className="pt-8 pb-16 lg:pt-32 lg:pb-16">
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
                <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                <Button size="lg" asChild>
                  <Link href="/demo">
                    {tCommon('requestDemo')}
                  </Link>
                    </Button>
                <Button variant="outline" size="lg" asChild>
                   <ChatRedirectLink>
                     <MessageSquare className="mr-2 h-4 w-4" />
                     {tCommon('talkToSales')}
                   </ChatRedirectLink>
                 </Button>
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
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-card shadow-sm">
                    <Image
                        className="object-cover"
                      src={slide.imageSrc}
                      alt={slideImageAlt}
                        fill
                      priority={true}
                        sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 40vw"
                    />
                    </div>
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
                          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-card shadow-sm">
                            <Image
                              className="object-cover"
                              src={slide.imageSrc}
                              alt={slideImageAlt}
                              fill
                              priority={index === 0}
                              sizes="(max-width: 1024px) 100vw, (max-width: 768px) 90vw, 40vw"
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
