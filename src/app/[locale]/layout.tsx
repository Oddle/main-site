import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { jsonLdScriptProps } from "react-schemaorg";
import { WebSite } from "schema-dts";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import LocaleChecker from '@/components/LocaleChecker';
import Script from 'next/script';

// --- Define BCP 47 language mapping (accessible to both RootLayout and generateMetadata) ---
const bcp47LangMap: { [key: string]: string } = {
  en: 'en',       // Or 'en-US' if preferred
  sg: 'en-SG',   // English for Singapore
  hk: 'en-HK',   // English for Hong Kong (as per user's last change)
  au: 'en-AU',   // English for Australia
  my: 'en-MY',   // English for Malaysia
  tw: 'zh-TW',   // Chinese for Taiwan
};
// ----------------------------------------------------------------------------------------

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

  // Use the mapped language code for the lang attribute
  const htmlLang = bcp47LangMap[locale] || locale; // Fallback to original locale if not mapped

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TM3W78RV');
          `}
        </Script>
        {/* End Google Tag Manager */}
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
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TM3W78RV" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <NextIntlClientProvider>{children}

          <LocaleChecker />

          </NextIntlClientProvider>
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const baseUrl = new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  const ogImageUrl = 'https://ucarecdn.com/3a4499ff-d4db-43e9-9db2-5f19976dcf78/-/preview/1000x523/';

  // --- Define Apple Touch Icon URL --- 
  const appleIconUrl = 'https://ucarecdn.com/d28a1327-3c7f-42cb-880e-46c9f109cb4a/-/preview/512x512/';
  // -----------------------------------

  // --- Debugging Logs ---
  const calculatedCanonical = new URL(`/${locale}`, baseUrl).toString();
  // ---------------------

  const languagesOutput = routing.locales.reduce((acc, loc) => {
    const mappedHreflang = bcp47LangMap[loc] || loc;
    const absoluteHref = new URL(`/${loc}`, baseUrl).toString();
    acc[mappedHreflang] = absoluteHref;
    return acc;
  }, {} as Record<string, string>);

  const defaultLocaleForXDefault = routing.defaultLocale || 'sg'; // Fallback for safety
  languagesOutput['x-default'] = new URL(`/${defaultLocaleForXDefault}`, baseUrl).toString();

  return {
    metadataBase: baseUrl, // Restored metadataBase
    title: t("title"),
    description: t("description"),
    icons: {
      apple: appleIconUrl,
    },
    keywords: t("keywords"),
    other: {
      "google-site-verification": "sVYBYfSJfXdBca3QoqsZtD6lsWVH6sk02RCH4YAbcm8",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: new URL(`/${locale}`, baseUrl).toString(), // Ensure OG URL is absolute
      siteName: "Oddle | Restaurant Revenue Growth Platform",
      images: [
        {
          url: ogImageUrl, 
          width: 1000, 
          height: 523, 
        },
      ],
      locale: bcp47LangMap[locale] || locale, // Use shared map for og:locale too
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImageUrl], 
    },
    alternates: {
      canonical: calculatedCanonical, // Using dynamically calculated value
      languages: languagesOutput,   // Using dynamically calculated value
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
