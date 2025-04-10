// src/components/sections/ABCSection.tsx

interface ABCItem {
  // Change props to expect direct strings
  title: string;       // Changed from titleKey
  description: string; // Changed from descriptionKey
}

interface ABCSectionProps {
  // Change props to expect direct strings
  title: string;       // Changed from titleKey
  subtitle: string;    // Changed from subtitleKey
  items: ABCItem[];
}

export default function ABCSection({ title, subtitle, items }: ABCSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="lg:w-3/4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {subtitle}
            </p>
          </div>
          <div className="space-y-6 lg:space-y-10">
            {items.map((item, index) => (
              <div className="flex" key={index}>
                <div className="ms-5 sm:ms-8">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 