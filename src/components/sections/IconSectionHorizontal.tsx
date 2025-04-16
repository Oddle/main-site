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
  ShieldCheck
} from "lucide-react"; // Import necessary icons
import { FC } from 'react';
import Container from "@/components/common/Container";

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
  sectionTag?: string | null; // Optional tag above title
  sectionTitle: string; // Main title
  items: ValueItem[];
}

export default function IconSectionHorizontal({ 
  sectionTag,
  sectionTitle,
  items = [] // Provide default empty array
}: IconSectionHorizontalProps) {

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
              {sectionTag}
            </p>
          )}
          <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            {sectionTitle}
          </h2>
        </div>

        {/* Items Grid Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, index) => {
            const IconComponent = item.icon ? iconMap[item.icon] : null;
            return (
              // Card-like div for each item
              <div key={index} className="rounded-lg bg-muted p-6 dark:bg-slate-800/50">
                {IconComponent && (
                  <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-background dark:bg-slate-900"> 
                    <IconComponent className="size-6 text-primary" />
                  </span>
                )}
                <h3 className="mb-2 text-xl font-medium">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
} 