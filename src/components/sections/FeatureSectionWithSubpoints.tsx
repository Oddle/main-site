import Image from 'next/image';
import { Cpu, Lock, Sparkles, Zap, Headset, Clock, Wifi, Mail, Repeat, Star, Database, BarChart, Shuffle } from 'lucide-react';
import { FC } from 'react';
import Container from "@/components/common/Container";

// Map icon names to actual components
const iconMap: { [key: string]: FC<React.SVGProps<SVGSVGElement>> } = {
  Cpu,
  Lock,
  Sparkles,
  Zap,
  Headset,
  Clock,
  Wifi,
  Mail,
  Repeat,
  Star,
  Database,
  BarChart,
  Shuffle,
  // Add other icons from lucide-react as needed
};

interface FeaturePoint {
  icon: keyof typeof iconMap; // Use keyof to ensure valid icon names
  title: string;
  description: string;
}

interface FeatureSectionWithSubpointsProps {
  i18nBaseKey?: string;
  heading?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageSrcDark?: string; // Optional dark mode image
  imageSrcLight?: string; // Optional light mode image
  features?: FeaturePoint[];
}

const FeatureSectionWithSubpoints = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  i18nBaseKey, // For potential i18n integration
  heading = "Default Heading", // Provide defaults or make required
  description = "Default description goes here.",
  imageSrc, // Main image source (used if dark/light aren't provided or needed)
  imageAlt = "Feature image",
  imageSrcDark,
  imageSrcLight,
  features = [ // Default features for demonstration
    { icon: "Zap", title: "Fast", description: "Default description for fast feature." },
    { icon: "Cpu", title: "Powerful", description: "Default description for powerful feature." },
    { icon: "Lock", title: "Secure", description: "Default description for secure feature." },
    { icon: "Sparkles", title: "AI Powered", description: "Default description for AI feature." },
  ],
}: FeatureSectionWithSubpointsProps) => {
  // TODO: Add useTranslations hook if i18nBaseKey is provided

  const darkImage = imageSrcDark || imageSrc;
  const lightImage = imageSrcLight || imageSrc;

  return (
    <section className="py-16 md:py-32">
      <Container>
        <div className="space-y-12">
          {/* Top Text Section */}
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
            {heading && (
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg leading-8 text-gray-600 dark:text-gray-300 md:ml-auto md:max-w-sm">
                {description}
              </p>
            )}
          </div>

          {/* Image Section */}
          {(darkImage || lightImage) && (
             <div className="relative rounded-2xl md:-mx-8"> {/* Adjusted rounding */}
              <div className="relative aspect-[88/36] w-full overflow-hidden rounded-2xl"> {/* Container for images */}
                {/* Optional gradient overlay */}
                {/* <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-background to-transparent"></div> */}

                {darkImage && (
                  <Image
                    src={darkImage}
                    alt={imageAlt}
                    fill
                    className="hidden object-cover dark:block"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw" // Example sizes
                  />
                )}
                {lightImage && (
                   <Image
                    src={lightImage}
                    alt={imageAlt}
                    fill
                    className="block object-cover dark:hidden"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw" // Example sizes
                  />
                )}
              </div>
            </div>
          )}


          {/* Features Grid Section */}
          {features && features.length > 0 && (
            <div className="relative mx-auto grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon];
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-3">
                      {IconComponent && (
                        <IconComponent className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                      )}
                      {feature.title && (
                        <h3 className="text-lg font-semibold dark:text-white">
                          {feature.title}
                        </h3>
                      )}
                    </div>
                    {feature.description && (
                      <p className="text-base text-muted-foreground">
                        {feature.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default FeatureSectionWithSubpoints;