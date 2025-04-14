// src/components/sections/ABCSection.tsx

import { useTranslations } from 'next-intl'; // Import hook
import { getTranslation } from '@/lib/i18nUtils'; // Import shared helper
import Container from "@/components/common/Container"; // Import Container

interface ABCItem {
  // Change props to expect direct strings
  title: string;       // Changed from titleKey
  description: string; // Changed from descriptionKey
}

interface ABCSectionProps {
  i18nBaseKey: string; // Added base key
  title: string;       // Changed from titleKey
  subtitle: string;    // Changed from subtitleKey
  items: ABCItem[];
}

export default function IconSectionHorizontal({ 
  i18nBaseKey, // Destructure base key
  title: defaultTitle, 
  subtitle: defaultSubtitle, 
  items 
}: ABCSectionProps) {
  const t = useTranslations(); // Initialize hook

  // Translate top-level props using imported helper
  const title = getTranslation(t, `${i18nBaseKey}.title`, defaultTitle);
  const subtitle = getTranslation(t, `${i18nBaseKey}.subtitle`, defaultSubtitle);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <Container>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="lg:w-3/4">
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
              {/* Use translated title */} 
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {/* Use translated subtitle */} 
              {subtitle}
            </p>
          </div>
          <div className="space-y-6 lg:space-y-10">
            {items.map((item: ABCItem, index: number) => { // Added types here
              // Translate item properties using the index directly
              const itemTitle = getTranslation(t, `${i18nBaseKey}.${index}.title`, item.title);
              const itemDescription = getTranslation(t, `${i18nBaseKey}.${index}.description`, item.description);
              
              return (
                <div className="flex" key={index}> {/* Use index for React key */}
                  <div className="ms-5 sm:ms-8">
                    <h3 className="text-base sm:text-lg font-semibold">
                      {/* Use translated item title */} 
                      {itemTitle}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      {/* Use translated item description */} 
                      {itemDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
} 