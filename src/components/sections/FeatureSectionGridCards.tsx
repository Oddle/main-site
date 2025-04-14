"use client";

import { SVGProps, useId } from "react";
import Image from 'next/image';

import { cn } from "@/lib/utils";
import Container from '@/components/common/Container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Interface for image data within an item
interface GridCardImage {
  src: string;
  alt: string;
  className?: string; // Classes for the container div controlling aspect ratio/size
}

// Interface for individual grid card items
interface GridCardItem {
  title: string | React.ReactNode;
  description: string[];
  image: GridCardImage;
  imagePosition: "top" | "left" | "right" | "bottom";
  className?: string; // Applied to the Card component (includes grid span)
  headerClassName?: string; // Applied to CardHeader (used within the text block)
  contentClassName?: string; // Optional: May not be needed if content is just description
  imageWrapperClassName?: string; // Optional class specifically for the image container div when position is left/right
}

// Interface for the main component props
interface FeatureSectionGridCardsProps {
  sectionTag?: string | null;
  sectionTitle: string;
  sectionDescription?: string | null;
  items: GridCardItem[];
}

// --- PlusSigns SVG Component --- 
interface PlusSignsProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const PlusSigns = ({ className, ...props }: PlusSignsProps) => {
  const GAP = 16;
  const STROKE_WIDTH = 1;
  const PLUS_SIZE = 6;
  const id = useId();
  const patternId = `plus-pattern-${id}`;

  return (
    <svg width={GAP * 2} height={GAP * 2} className={className} {...props}>
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={GAP}
          height={GAP}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1={GAP / 2}
            y1={(GAP - PLUS_SIZE) / 2}
            x2={GAP / 2}
            y2={(GAP + PLUS_SIZE) / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={(GAP - PLUS_SIZE) / 2}
            y1={GAP / 2}
            x2={(GAP + PLUS_SIZE) / 2}
            y2={GAP / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

// --- Main Component --- 
const FeatureSectionGridCards = ({ 
  sectionTag,
  sectionTitle,
  sectionDescription,
  items = [] 
}: FeatureSectionGridCardsProps) => {

  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <Container>
        {/* Added Header Section */} 
        <div className="mb-12 text-center md:mb-16">
          {sectionTag && (
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20">
              {sectionTag}
            </span>
          )}
          {sectionTitle && (
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
               {sectionTitle}
             </h2>
          )}
          {sectionDescription && (
             <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
               {sectionDescription}
             </p>
          )}
        </div>
        {/* End Header Section */} 

        {/* Grid - Removed Container wrapper from here */}
        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-5">
          {items.map((item, index) => {
            // Helper function to render the image element
            const renderImage = () => (
              <div className={cn(
                "relative w-full", // Base classes
                (item.imagePosition === 'left' || item.imagePosition === 'right') 
                  ? item.imageWrapperClassName // Use specific wrapper class for side-by-side
                  : item.image.className, // Use image className for top/bottom
                // Ensure relative positioning for fill to work
                'relative' 
              )}> 
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover" // Let container handle rounding
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw" 
                />
              </div>
            );

            // Helper function to render the text content
            const renderTextContent = () => (
              // Flex-1 allows text content to take available space in row layout
              <div className={cn("flex-1", item.headerClassName)}> 
                <CardHeader className={cn("p-6")}> {/* Keep padding on header */} 
                  <CardTitle className="!mt-0 text-2xl md:text-3xl">{item.title}</CardTitle>
                  {item.description.map((desc, i) => (
                    <CardDescription
                      key={i}
                      className="mt-2 text-base leading-relaxed"
                    >
                      {desc}
                    </CardDescription>
                  ))}
                </CardHeader>
                {/* CardContent might be needed if other elements go here, keeping structure simple for now */}
                {/* <CardContent className={cn("p-6 pt-0", item.contentClassName)}> </CardContent> */}
              </div>
            );

            return (
              <Card
                key={index}
                className={cn(
                  "col-span-1 overflow-hidden shadow-md dark:shadow-none",
                  // Add flex classes for left/right positions
                  (item.imagePosition === 'left' || item.imagePosition === 'right') && 'flex items-stretch',
                  item.imagePosition === 'right' && 'flex-row-reverse',
                  item.className
                )}
              >
                {/* Render based on imagePosition */} 
                {item.imagePosition === 'top' && (
                  <>
                    {renderImage()}
                    {renderTextContent()}
                  </>
                )}
                {(item.imagePosition === 'left' || item.imagePosition === 'right') && (
                  <>
                    {/* Image needs wrapper for flex sizing */} 
                    <div className={cn("flex items-center justify-center", item.imageWrapperClassName)}> 
                       {renderImage()}
                    </div>
                    {renderTextContent()}
                  </>
                )}
                {item.imagePosition === 'bottom' && (
                  <>
                    {renderTextContent()}
                    {renderImage()}
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </Container>

      {/* Background decoration - consider making optional via props? */}
      <>
        <div className="absolute inset-0 opacity-50 dark:opacity-100"> {/* Adjusted opacity */} 
          <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/5 absolute top-1/2 left-0 size-[700px] -translate-y-1/2 rounded-full blur-[150px] md:blur-[300px] will-change-transform" /> {/* Example gradient */} 
          <div className="bg-gradient-to-tl from-green-500/10 via-teal-500/5 to-cyan-500/10 absolute top-1/2 right-0 size-[700px] -translate-y-1/2 -translate-x-1/4 rounded-full blur-[150px] md:blur-[300px] will-change-transform" /> {/* Example gradient */} 
          {/* <div className="bg-gradient-3/[0.06] absolute right-20 bottom-10 h-[500px] w-[800px] -rotate-12 rounded-full blur-[100px] will-change-transform" /> */}
        </div>
        <div className="absolute -inset-x-20 top-0 h-full [mask-image:radial-gradient(circle_at_center,black_0%,black_20%,transparent_85%)]"> {/* Added h-full */} 
          <PlusSigns className="h-full w-full text-foreground/[0.03]" /> {/* Reduced opacity */} 
        </div>
      </>
    </section>
  );
};

export default FeatureSectionGridCards; 