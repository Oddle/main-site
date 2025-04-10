"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// --- Updated Interfaces (Using Direct Strings) ---
interface BentoCardData {
  id: string | number;
  type: 'large' | 'small' | 'wide'; // Type likely not translated
  title: string; // Expect translated title
  description: string; // Expect translated description
  imageUrl?: string; // URL likely not translated
  imageAlt?: string; // Expect translated alt text
  className?: string;
}

interface BentoGridSectionProps {
  // Remove namespace prop
  badgeText?: string; // Expect translated badge text
  title?: string; // Expect translated title
  description?: string; // Expect translated description
  getStartedLink?: string; // Link likely not translated
  previewLink?: string; // Link likely not translated
  cards?: BentoCardData[];
  // Expect translated button text if buttons are added/used
  getStartedButtonText?: string;
  livePreviewButtonText?: string;
}

// --- Default Data (Using Direct Strings - Update if defaults needed) ---
// Defaults may not be necessary if props are always passed from HomeIndex
// const defaultCards: BentoCardData[] = [ ... updated ... ];
// const defaultProps: Required<BentoGridSectionProps> = { ... updated ... };


// --- Updated Component ---
export default function BentoGridSection({
  // Remove namespace, defaults might not be needed if always populated
  badgeText,
  title,
  description,
  cards = [], // Default to empty array
}: BentoGridSectionProps) {

  // Remove useTranslations hook call
  // const t = useTranslations(namespace);

  // Remove parser hint block

  // Helper to determine card classes based on type
  const getCardClasses = (card: BentoCardData): string => {
    switch (card.type) {
      case 'large':
        return "sm:col-span-2 md:col-span-2 row-span-2";
      case 'wide':
        return "sm:col-span-2 md:col-span-2";
      case 'small':
      default:
        return "sm:col-span-1";
    }
  };

  return (
    <>
      {/* Bento Section */}
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        <div className="relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {badgeText && (
              <Badge variant="outline" className="mb-4">
                {badgeText} {/* Render badge text directly */}
              </Badge>
            )}
            {title && (
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                {title} {/* Render title directly */}
              </h1>
            )}
            {description && (
              <p className="text-xl text-muted-foreground mb-8">
                {description} {/* Render description directly */}
              </p>
            )}
             {/* Optional: Add buttons here using getStartedButtonText and livePreviewButtonText */}
            {/* Example:
            {(getStartedButtonText || livePreviewButtonText) && (
              <div className="flex justify-center gap-4">
                {getStartedButtonText && getStartedLink && <Link href={getStartedLink}><Button>{getStartedButtonText}</Button></Link>}
                {livePreviewButtonText && previewLink && <Link href={previewLink}><Button variant="outline">{livePreviewButtonText}</Button></Link>}
              </div>
            )}
             */}
          </div>

          {/* Bento Grid - Dynamic Rendering */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {cards.map((card) => (
              <Card
                key={card.id}
                className={`p-6 hover:shadow-lg transition-shadow ${getCardClasses(card)} ${card.className || ''}`}
              >
                {card.type === 'large' ? (
                  <div className="h-full flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">
                      {card.title} {/* Render card title directly */}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {card.description} {/* Render card description directly */}
                    </p>
                    {card.imageUrl && (
                      <Image
                        src={card.imageUrl}
                        alt={card.imageAlt || card.title} // Use direct alt or title
                        width={600}
                        height={400}
                        className="rounded-lg mt-auto object-cover"
                      />
                    )}
                  </div>
                ) : card.type === 'wide' ? (
                   <div className="flex items-center gap-4 h-full">
                    <div>
                      <h3 className="text-lg font-semibold">{card.title}</h3> {/* Render directly */}
                      <p className="text-muted-foreground">
                        {card.description} {/* Render directly */}
                      </p>
                    </div>
                  </div>
                ) : ( // Small card
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{card.title}</h3> {/* Render directly */}
                    <p className="text-muted-foreground">
                      {card.description} {/* Render directly */}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* End Bento Section */}
    </>
  );
} 