"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

// --- Updated Interfaces (Using Keys) ---
interface BentoCardData {
  id: string | number;
  type: 'large' | 'small' | 'wide';
  titleKey: string; // Key for title translation
  descriptionKey: string; // Key for description translation
  imageUrl?: string;
  imageAlt?: string; // Alt text might still be direct or use a key if needed
  className?: string;
}

interface BentoGridSectionProps {
  namespace?: string; // Optional namespace override
  badgeTextKey?: string; // Key for badge translation
  titleKey?: string; // Key for title translation
  descriptionKey?: string; // Key for description translation
  getStartedLink?: string;
  previewLink?: string;
  cards?: BentoCardData[];
  // Add keys for buttons if they should be configurable per section instance
  getStartedButtonKey?: string;
  livePreviewButtonKey?: string;
}

// --- Default Data (Using Keys) ---
const defaultCards: BentoCardData[] = [
  {
    id: 1,
    type: 'large',
    titleKey: 'card1Title',
    descriptionKey: 'card1Description',
    imageUrl: 'https://placehold.co/600x400/E2E8F0/AAAAAA?text=Dashboard+View',
    imageAlt: 'Unified Dashboard Preview', // Keep Alt text direct for now, or use a key
  },
  {
    id: 2,
    type: 'small',
    titleKey: 'card2Title',
    descriptionKey: 'card2Description',
  },
  {
    id: 3,
    type: 'small',
    titleKey: 'card3Title',
    descriptionKey: 'card3Description',
  },
  {
    id: 4,
    type: 'wide',
    titleKey: 'card4Title',
    descriptionKey: 'card4Description',
  },
];

// Default props now use the keys
const defaultProps: Required<Omit<BentoGridSectionProps, 'namespace'>> = {
    badgeTextKey: "defaultBadge",
    titleKey: "defaultTitle",
    descriptionKey: "defaultDescription",
    getStartedLink: "#get-started",
    previewLink: "#preview",
    cards: defaultCards,
    getStartedButtonKey: "getStartedButton", // Default button keys
    livePreviewButtonKey: "livePreviewButton"
}

// --- Updated Component ---
export default function BentoGridSection({
  namespace = "BentoGridSection", // Default namespace
  badgeTextKey = defaultProps.badgeTextKey,
  titleKey = defaultProps.titleKey,
  descriptionKey = defaultProps.descriptionKey,
  getStartedLink = defaultProps.getStartedLink,
  previewLink = defaultProps.previewLink,
  cards = defaultProps.cards,
  getStartedButtonKey = defaultProps.getStartedButtonKey,
  livePreviewButtonKey = defaultProps.livePreviewButtonKey,
}: BentoGridSectionProps) {

  // Get translation function for the specified namespace
  const t = useTranslations(namespace);
  // Optionally get a translator for a global namespace if buttons keys live there
  // const tGlobal = useTranslations('Global');

  // i18next-parser Hint block:
  // Add full keys here for the parser to find them.
  // Make sure these keys exist in your locale files under the relevant namespace.
  /*
  t('BentoGridSection.defaultBadge');
  t('BentoGridSection.defaultTitle');
  t('BentoGridSection.defaultDescription');
  t('BentoGridSection.card1Title');
  t('BentoGridSection.card1Description');
  t('BentoGridSection.card2Title');
  t('BentoGridSection.card2Description');
  t('BentoGridSection.card3Title');
  t('BentoGridSection.card3Description');
  t('BentoGridSection.card4Title');
  t('BentoGridSection.card4Description');
  // Button Keys (adjust namespace if needed):
  t('BentoGridSection.getStartedButton');
  t('BentoGridSection.livePreviewButton');
  // Or if using a global namespace:
  // tGlobal('getStartedButton');
  // tGlobal('livePreviewButton');
  */

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
            {badgeTextKey && (
              <Badge variant="outline" className="mb-4">
                {/* i18next-parser Hint: t('Namespace.badgeTextKey') */} 
                {t(badgeTextKey)}
              </Badge>
            )}
             {/* i18next-parser Hint: t('Namespace.titleKey') */}
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              {t(titleKey)}
            </h1>
            {/* i18next-parser Hint: t('Namespace.descriptionKey') */}
            <p className="text-xl text-muted-foreground mb-8">
              {t(descriptionKey)}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" asChild>
                {/* i18next-parser Hint: t('NamespaceOrGlobal.getStartedButtonKey') */} 
                <Link href={getStartedLink}>{t(getStartedButtonKey)}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                 {/* i18next-parser Hint: t('NamespaceOrGlobal.livePreviewButtonKey') */} 
                 <Link href={previewLink}>{t(livePreviewButtonKey)}</Link>
              </Button>
            </div>
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
                     {/* i18next-parser Hint: t('Namespace.card.titleKey') */} 
                    <h3 className="text-xl font-semibold mb-2">
                      {t(card.titleKey)}
                    </h3>
                    {/* i18next-parser Hint: t('Namespace.card.descriptionKey') */} 
                    <p className="text-muted-foreground mb-4">
                      {t(card.descriptionKey)}
                    </p>
                    {card.imageUrl && (
                      <Image
                        src={card.imageUrl}
                        alt={card.imageAlt || t(card.titleKey)} // Using translated title as fallback alt
                        width={600}
                        height={400}
                        className="rounded-lg mt-auto object-cover"
                      />
                    )}
                  </div>
                ) : card.type === 'wide' ? (
                   <div className="flex items-center gap-4 h-full">
                    <div>
                      {/* i18next-parser Hint: t('Namespace.card.titleKey') */} 
                      <h3 className="text-lg font-semibold">{t(card.titleKey)}</h3>
                       {/* i18next-parser Hint: t('Namespace.card.descriptionKey') */} 
                      <p className="text-muted-foreground">
                        {t(card.descriptionKey)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* i18next-parser Hint: t('Namespace.card.titleKey') */} 
                    <h3 className="text-lg font-semibold mb-2">{t(card.titleKey)}</h3>
                    {/* i18next-parser Hint: t('Namespace.card.descriptionKey') */} 
                    <p className="text-muted-foreground">
                      {t(card.descriptionKey)}
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