"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import DemoRequestForm from "@/components/forms/DemoRequestForm";

// This component now holds the specific content for the demo page.
// It will be rendered by DynamicSectionPage.

// Props are likely minimal for this specific content component,
// but we can add locale if needed for child components later.
interface DemoPageContentProps {
  locale: string;
  // Add other props if needed later
}

export default function DemoPageContent({ locale }: DemoPageContentProps) {
  const t = useTranslations("demoPage");

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Info */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              {t("leftColumn.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.rich("leftColumn.description", {
                flags: () => <span className="font-semibold">{t("leftColumn.flags")}</span>,
                b: (chunks) => <span className="font-semibold">{chunks}</span>,
              })}
            </p>

            <div className="pt-6">
              <h2 className="text-2xl font-semibold mb-3">
                {t("leftColumn.chatTitle")}
              </h2>
              <p className="text-muted-foreground mb-5">
                {t("leftColumn.chatDescription")}
              </p>
              <Button variant="outline" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                {t("leftColumn.chatButton")}
              </Button>
            </div>
          </div>

          {/* Right Column: Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {t("form.title")}
            </h2>
            <DemoRequestForm /> {/* Assuming DemoRequestForm doesn't need locale directly */}
          </div>
        </div>
      </Container>
    </section>
  );
} 