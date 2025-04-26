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
import { Toaster } from "@/components/ui/sonner";

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
          <Toaster />
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
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  // Use the environment variable for metadataBase
  const baseUrl = new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  // --- Update the default image URL --- 
  const ogImageUrl = 'https://ucarecdn.com/3a4499ff-d4db-43e9-9db2-5f19976dcf78/-/preview/1000x523/'; // Use absolute URL
  // ------------------------------------

  const languages: Record<string, string> = {};
  routing.locales.forEach(loc => {
    // Construct absolute URLs for alternates if metadataBase is set
    languages[loc] = `${baseUrl.origin}/${loc}`;
  });
  languages['x-default'] = `${baseUrl.origin}/${routing.defaultLocale}`;

  return {
    metadataBase: baseUrl,
    title: t("title"),
    description: t("description"),
    viewport: {
      width: 'device-width',
      initialScale: 1,
    },
    keywords: t("keywords"),
    other: {
      "google-site-verification": "sVYBYfSJfXdBca3QoqsZtD6lsWVH6sk02RCH4YAbcm8",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      siteName: "Oddle | Restaurant Revenue Growth Platform",
      images: [
        {
          url: ogImageUrl, // This will now use the absolute URL
          width: 1000, // Update width based on the image dimensions if known
          height: 523, // Update height based on the image dimensions if known
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImageUrl], // This will now use the absolute URL
    },
    alternates: {
      // Keep canonical relative here
      canonical: `/${locale}`,
      // Keep languages relative if canonical is relative
      languages: routing.locales.reduce((acc, loc) => {
          acc[loc] = `/${loc}`;
          return acc;
        }, {} as Record<string, string>),
      // Or provide absolute URLs if preferred (uncomment below)
      /*
      languages: routing.locales.reduce((acc, loc) => {
          acc[loc] = `${baseUrl.origin}/${loc}`;
          return acc;
        }, {} as Record<string, string>),
      'x-default': `${baseUrl.origin}/${routing.defaultLocale}`, 
      */
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
  };
}
