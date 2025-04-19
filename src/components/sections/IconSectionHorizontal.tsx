// src/components/sections/IconSectionHorizontal.tsx

import { 
  Timer, 
  Zap, 
  ZoomIn, 
  Database, 
  Megaphone, 
  TrendingUp,
  Settings, 
  Package, 
  Truck,
  Headset,
  Clock,
  Wifi,
  BarChart,
  Shuffle,
  Users,
  ShieldCheck,
  DollarSign,
  Eye
} from "lucide-react"; // Import necessary icons
import { FC } from 'react';
import Container from "@/components/common/Container";
import { useTranslations } from 'next-intl'; // Import useTranslations
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper

// Map icon names to actual components
const iconMap: { [key: string]: FC<React.SVGProps<SVGSVGElement>> } = {
  Timer,
  Zap,
  ZoomIn,
  Database,
  Megaphone,
  TrendingUp,
  Settings,
  Package,
  Truck,
  Headset,
  Clock,
  Wifi,
  BarChart,
  Shuffle,
  Users,
  ShieldCheck,
  DollarSign,
  Eye,
  // Add other icons from lucide-react as needed
};

// Updated interface for individual items
interface ValueItem {
  icon?: keyof typeof iconMap; // Icon name is now optional
  title: string;
  description: string;
}

// Updated interface for section props
interface IconSectionHorizontalProps {
  i18nBaseKey?: string; // Add base key prop
  sectionTag?: string | null; // Optional tag above title
  sectionTitle: string; // Main title
  items: ValueItem[];
}

export default function IconSectionHorizontal({ 
  i18nBaseKey, // Destructure base key
  sectionTag: defaultSectionTag, // Rename default props
  sectionTitle: defaultSectionTitle,
  items = [] // Provide default empty array
}: IconSectionHorizontalProps) {
  const t = useTranslations(); // Initialize hook

  // Translate section header if i18nBaseKey is provided
  const sectionTag = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.tag`, defaultSectionTag ?? '') : defaultSectionTag;
  const sectionTitle = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultSectionTitle) : defaultSectionTitle;

  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  return (
    // Updated section padding and removed background
    <section className="w-full py-16 md:py-24 lg:py-32">
      <Container>
        {/* Header Section - Centered */} 
        <div className="mb-12 text-center md:mb-16 lg:mb-20">
          {sectionTag && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary md:mb-3 lg:text-base">
              {sectionTag} {/* Use translated tag */}
            </p>
          )}
          <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            {sectionTitle} {/* Use translated title */}
          </h2>
        </div>

        {/* Items Grid Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, index) => {
            const IconComponent = item.icon ? iconMap[item.icon] : null;
            const itemBaseKey = `${i18nBaseKey}.items.${index}`;

            // Translate item properties if i18nBaseKey is provided
            const itemTitle = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.title`, item.title) : item.title;
            const itemDescription = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.description`, item.description) : item.description;

            return (
              // Card-like div for each item
              <div key={index} className="rounded-lg bg-muted p-6 dark:bg-slate-800/50">
                {IconComponent && (
                  <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-background dark:bg-slate-900"> 
                    <IconComponent className="size-6 text-primary" />
                  </span>
                )}
                <h3 className="mb-2 text-xl font-medium">
                  {itemTitle} {/* Use translated title */}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {itemDescription} {/* Use translated description */}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
} 