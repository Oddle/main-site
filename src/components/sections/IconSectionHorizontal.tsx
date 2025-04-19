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

// Interface for individual items
interface StandardItemData { // Rename
  icon?: keyof typeof iconMap; 
  title: string;
  description: string;
}

// Standardized props interface
interface IconSectionHorizontalProps {
  i18nBaseKey?: string; 
  tag?: string | null; // Rename sectionTag
  title: string; // Rename sectionTitle
  // Removed description as it wasn't used
  items: StandardItemData[]; // Keep items
}

export default function IconSectionHorizontal({ 
  i18nBaseKey, 
  tag: defaultTag, // Rename
  title: defaultTitle, // Rename
  items = [] 
}: IconSectionHorizontalProps) {
  const t = useTranslations(); 

  // Translate section header 
  const tag = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.tag`, defaultTag ?? '') : defaultTag;
  const title = i18nBaseKey ? getTranslation(t, `${i18nBaseKey}.title`, defaultTitle) : defaultTitle;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <Container>
        {/* Header Section - Centered */}
        <div className="mb-12 text-center md:mb-16 lg:mb-20">
          {/* Render tag */}
          {tag && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary md:mb-3 lg:text-base">
              {tag} 
            </p>
          )}
          {/* Use title */}
          <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            {title} 
          </h2>
        </div>

        {/* Items Grid Section - Use items */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, index) => {
            const IconComponent = item.icon ? iconMap[item.icon] : null;
            const itemBaseKey = `${i18nBaseKey}.items.${index}`; // Use items in key

            // Translate item properties
            const itemTitle = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.title`, item.title) : item.title;
            const itemDescription = i18nBaseKey ? getTranslation(t, `${itemBaseKey}.description`, item.description) : item.description;

            return (
              <div key={index} className="rounded-lg bg-muted p-6 dark:bg-slate-800/50">
                {IconComponent && (
                  <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-background dark:bg-slate-900"> 
                    <IconComponent className="size-6 text-primary" />
                  </span>
                )}
                <h3 className="mb-2 text-xl font-medium">
                  {itemTitle} {/* Use translated */}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {itemDescription} {/* Use translated */}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
} 