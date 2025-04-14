import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; // Using Next.js Image for optimization
import Container from "@/components/common/Container"; // Import Container

interface TimelineFeature {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
}

interface TimelineSectionProps {
  i18nBaseKey?: string; // Optional key for internationalization
  heading?: string;
  description?: string;
  primaryButton?: {
    text: string;
    action: string; // Could be a URL or other action identifier
  };
  secondaryButton?: {
    text: string;
    action: string;
  };
  features?: TimelineFeature[];
}

const TimelineSection = ({
  heading = "Experience the difference with us",
  description = "We believe in creating lasting partnerships with our clients, focusing on long-term success through collaborative innovation and dedicated support.",
  primaryButton, // No default buttons, should be provided via props
  secondaryButton,
  features = [ // Default features for demonstration
    {
      imageSrc: "https://placehold.co/600x400/E2E8F0/AAAAAA?text=Feature+1",
      imageAlt: "Placeholder Feature 1",
      title: "Dedicated Support",
      description:
        "Expanded operations to 5 new countries, reaching millions of new users.",
    },
    {
      imageSrc: "https://placehold.co/600x400/CCDDAA/AAAAAA?text=Feature+2",
      imageAlt: "Placeholder Feature 2",
      title: "Series B Funding",
      description:
        "Secured $50M in Series B funding to accelerate product development.",
    },
    {
      imageSrc: "https://placehold.co/600x400/E8F0E2/AAAAAA?text=Feature+3",
      imageAlt: "Placeholder Feature 3",
      title: "Product Launch",
      description: "Successfully launched our flagship product to market.",
    },
    {
      imageSrc: "https://placehold.co/600x400/F0E8E2/AAAAAA?text=Feature+4",
      imageAlt: "Placeholder Feature 4",
      title: "Company Founded",
      description: "Started with a vision to revolutionize the industry.",
    },
  ],
}: TimelineSectionProps) => {
  // TODO: Add useTranslations hook if i18nBaseKey is provided

  return (
    <section className="py-24 sm:py-32">
       <Container>
          <div className="relative grid gap-16 md:grid-cols-2">
            <div className="top-32 h-fit md:sticky"> {/* Adjusted stickiness */}
              {heading && (
                <h2 className="mt-4 mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                {primaryButton && (
                  <Button size="lg" asChild>
                    <Link href={primaryButton.action}>{primaryButton.text}</Link>
                  </Button>
                )}
                {secondaryButton && (
                   <Button variant="outline" size="lg" asChild>
                    <Link href={secondaryButton.action}>{secondaryButton.text}</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-12 md:gap-16"> {/* Adjusted gap */}
              {features && features.map((feature, index) => (
                <div key={index} className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow dark:border-gray-700">
                  {feature.imageSrc && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt || feature.title}
                        fill // Use fill to cover the container
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw" // Example sizes, adjust as needed
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {feature.title && (
                      <h3 className="mb-2 text-xl font-semibold tracking-tight dark:text-white">
                        {feature.title}
                      </h3>
                    )}
                    {feature.description && (
                      <p className="text-base text-muted-foreground">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
       </Container>
    </section>
  );
};

export default TimelineSection;
