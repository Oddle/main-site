"use client";

import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  LucideGitGraph, // Assuming this is the intended icon name
  MessageSquare,
  Star,
  Zap,
  LayoutTemplate,
  Target
} from "lucide-react";
import { FC } from 'react';

import { cn } from '@/lib/utils';
import Container from '@/components/common/Container';

// Map icon names for the component
const iconMap: { [key: string]: FC<React.SVGProps<SVGSVGElement>> } = {
  CheckCircle2,
  LucideGitGraph,
  MessageSquare,
  Star,
  Zap,
  LayoutTemplate,
  Target,
  // Add others if needed
};

// Interface for the list items in the second block
interface ListItem {
  text: string;
  icon?: keyof typeof iconMap; // Optional icon override (defaults to CheckCircle2)
}

// Interface for the stats in the third block
interface StatItem {
  value: string;
  label: string;
  isRating?: boolean; // Special handling for star rating
}

// Interface for the component props
interface FeatureSectionComplexGridProps {
  sectionTitle: string;
  sectionDescription?: string | null;

  block1: {
    icon: keyof typeof iconMap;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
  };

  block2: {
    icon: keyof typeof iconMap;
    title: string;
    listItems: ListItem[];
  };

  block3: {
    title: string;
    stats: StatItem[]; // Expecting two stats based on example
  };

  ctaText?: string | null;
  ctaLink?: string | null;
  ctaLinkText?: string | null;
}


const FeatureSectionComplexGrid = ({
  sectionTitle,
  sectionDescription,
  block1,
  block2,
  block3,
  ctaText,
  ctaLink,
  ctaLinkText,
}: FeatureSectionComplexGridProps) => {

  const Block1Icon = iconMap[block1.icon];
  const Block2Icon = iconMap[block2.icon];

  return (
    <section className="bg-muted/60 py-16 md:py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-10 md:gap-12 lg:gap-16">
          {/* Header */}
          <div className="mx-auto flex max-w-screen-md flex-col gap-2.5 text-center">
            <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
              {sectionTitle}
            </h1>
            {sectionDescription && (
              <p className="text-base text-muted-foreground md:text-lg">
                {sectionDescription}
              </p>
            )}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-3 lg:gap-8"> {/* Adjusted gaps */}

            {/* Block 1: Large Card (2 cols) */}
            <div className="col-span-1 rounded-lg bg-background p-6 shadow-sm md:p-7 lg:col-span-2 flex flex-col md:flex-row gap-6">
               <div className="flex h-full w-full md:w-1/2 flex-col justify-between gap-3">
                <div>
                  {Block1Icon && (
                    <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted dark:bg-slate-800 lg:size-14">
                      <Block1Icon className="h-auto w-5 lg:w-6 text-primary" />
                    </span>
                  )}
                  <h2 className="text-xl font-semibold lg:text-2xl">
                    {block1.title}
                  </h2>
                </div>
                <p className="text-base text-muted-foreground">
                  {block1.description}
                </p>
              </div>
              <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto">
                 <Image
                   src={block1.imageSrc}
                   alt={block1.imageAlt}
                   fill
                   className="rounded-lg object-cover" // Rounded corners
                   sizes="(max-width: 768px) 90vw, (max-width: 1024px) 40vw, 33vw"
                 />
              </div>
            </div>

            {/* Block 2: Small Card (1 col) */}
            <div className="col-span-1 rounded-lg bg-background p-6 shadow-sm md:p-7">
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  {Block2Icon && (
                     <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted dark:bg-slate-800 lg:size-14">
                       <Block2Icon className="h-auto w-5 lg:w-6 text-primary" />
                     </span>
                  )}
                  <h2 className="text-xl font-semibold lg:text-2xl">
                    {block2.title}
                  </h2>
                </div>
                <ul className="flex flex-col gap-4">
                  {block2.listItems.map((item, index) => {
                    const ItemIcon = item.icon ? iconMap[item.icon] : CheckCircle2;
                    return (
                       <li key={index} className="flex items-center gap-2 text-base">
                         <ItemIcon className="size-5 shrink-0 text-primary" />
                         <span>{item.text}</span>
                       </li>
                    );
                   })}
                 </ul>
               </div>
             </div>
           </div>

          {/* Block 3: Stats Bar */}
           <div className="grid items-center gap-6 rounded-lg bg-background p-6 shadow-sm md:p-8 lg:grid-cols-3 lg:gap-8">
             <h2 className="text-lg font-semibold lg:text-xl col-span-1 lg:col-span-3"> {/* Title spanning full width */}
               {block3.title}
             </h2>
             {block3.stats.map((stat, index) => (
               <div key={index} className={cn("flex items-center gap-3", stat.isRating ? "lg:col-span-2" : "lg:col-span-1")}> {/* Adjust span for rating */} 
                 <span className="text-4xl font-semibold md:text-5xl text-primary">
                   {stat.value}
                 </span>
                 {stat.isRating ? (
                   <div className="flex flex-col gap-1">
                     <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className="fill-primary text-primary size-5" /> // Assuming 5 stars
                       ))}
                     </div>
                     <p className="text-sm text-muted-foreground">{stat.label}</p>
                   </div>
                 ) : (
                   <p className="text-sm text-muted-foreground">{stat.label}</p>
                 )}
               </div>
             ))}
           </div>

          {/* CTA Link */}
           {ctaText && ctaLink && ctaLinkText && (
             <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
               <MessageSquare className="h-auto w-4 text-muted-foreground" />
               <p className="text-center text-base text-muted-foreground">
                 {ctaText}
               </p>
               <Link href={ctaLink} className="text-base font-medium text-primary underline hover:text-primary/80">
                 {ctaLinkText}
               </Link>
             </div>
           )}
         </div>
       </Container>
     </section>
   );
 };

 export default FeatureSectionComplexGrid; 