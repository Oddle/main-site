import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { jsonLdScriptProps } from "react-schemaorg";
import { WebSite } from "schema-dts";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Read the base URL (needed for JSON-LD script)
// We can read it here because layout components can be async
const baseUrlString = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata" });
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="keywords" content={t("keywords")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          {...jsonLdScriptProps<WebSite>({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: t("title"),
            description: t("description"),
            url: baseUrlString, // Use the base URL variable
            inLanguage: locale,
          })}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Define Props type for generateMetadata
type Props = {
  params: { locale: string };
};

export function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = params;

  // Call getTranslations asynchronously within the function
  const tPromise = getTranslations({ locale, namespace: "Metadata" });

  const languages: Record<string, string> = {};
  routing.locales.forEach(loc => {
    languages[loc] = `/${loc}`;
  });
  languages['x-default'] = '/';

  // Define relative paths for images/URLs
  const ogImageUrl = '/og-image.png';

  // Resolve the translation promise before returning
  return tPromise.then(t => ({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    other: {
      "google-site-verification": "sVYBYfSJfXdBca3QoqsZtD6lsWVH6sk02RCH4YAbcm8",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      // Use relative path for URL, Next.js combines with metadataBase
      url: `/${locale}`, // Default OG url for the layout (can be overridden by page)
      siteName: "Next.js i18n Boilerplate", // Keep or make dynamic
      images: [
        {
          url: ogImageUrl, // Relative path
          width: 1200,
          height: 630,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImageUrl], // Relative path
    },
    alternates: {
      canonical: `/${locale}`,
      languages: languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }));
}
