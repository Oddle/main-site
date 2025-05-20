import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from "next-intl/server";
// import Image from "next/image"; // Unused
import { Check, ShoppingCart, CalendarClock, CreditCard, Heart, Presentation, ClipboardList, Megaphone, BrainCircuit, Network, MessageSquare } from "lucide-react";
// import { Separator } from "@/components/ui/separator"; // Unused
import { Link } from "@/i18n/navigation"; // Changed from "next/link"
// Remove unused Accordion imports
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import clsx from 'clsx'; // Import clsx

import { generatePageMetadata } from '@/lib/metadataUtils';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';
import Container from '@/components/common/Container';
// Remove unused Card imports
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Import ChatRedirectLink
import ChatRedirectLink from "@/components/common/ChatRedirectLink";

// Define type for locale pricing data (revert to any[])
// First define the shape of a single product based on pricing.json
// Remove unused interface
// interface ProductCTA { textKey: string; href: string; variant?: string; }
// interface ProductPricing { ... }

interface PricingData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any[]; // Revert to any[] for now
}

// Import the pricing data
import pricingDataJson from "@/data/pricing.json";
const pricingData: PricingData = pricingDataJson; // Cast to defined type

// Re-import common data
import commonDataJson from "@/data/common.json"; // Import as json

// Define a type for products in common.json to help with type checking
interface CommonProductDataEntry {
  name: string;
  description: string;
  href: string;
  category: string;
  excludedLocales?: string[]; // excludedLocales is optional
}

interface CommonData {
  products: {
    [key: string]: CommonProductDataEntry;
  };
  // Add other top-level keys from common.json if needed for typing
}

const commonData: CommonData = commonDataJson as CommonData; // Cast to the defined type

// Metadata generation (Updated for async params)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  // Await the params promise to resolve
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Now call the helper with the resolved locale
  return generatePageMetadata({ locale, pageKey: 'pricing' });
}

// Define types for pricing details (improves type safety)
interface PricingDetailBase { type: string; }
interface TextDetail extends PricingDetailBase { type: 'text'; text: string; }
interface TierDetail extends PricingDetailBase { type: 'tier'; label: string; rate: string; unit: string; }
interface RateDetail extends PricingDetailBase { type: 'rate'; label: string; rate: string; note?: string; contactLink?: string; }
interface ActionDetail extends PricingDetailBase { type: 'action'; label: string; rate: string; }
type PricingDetail = TextDetail | TierDetail | RateDetail | ActionDetail;

// Define type for the translation function (revert to any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFunction = (key: string, options?: Record<string, any>) => string;

// Helper function to render pricing details (updated types)
function renderPricingDetails(details: PricingDetail[], t: TFunction) {
  return (
    // Keep outer div for spacing
    <div className="text-sm text-muted-foreground mt-2 space-y-1">
      {details.map((detail, index) => {
        if (detail.type === 'text') {
          // Render text simply, doesn't fit 2-column well
          return <div key={index}>{detail.text}</div>;
        } else if (detail.type === 'tier') {
          // Use flex to align label left, rate right
          return (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{detail.label}:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{`${detail.rate} ${detail.unit}`}</span>
            </div>
          );
        } else if (detail.type === 'rate') {
          // Use flex to align label left, rate+note right
          return (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{detail.label}:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {detail.rate}
                {detail.note &&
                  <> (<a href={detail.contactLink} className="text-primary hover:underline">{detail.note.includes('.') ? t(detail.note) : detail.note}</a>)</>
                }
              </span>
            </div>
          );
        } else if (detail.type === 'action') {
          // Use flex to align label left, rate right
          return (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{detail.label}:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{detail.rate}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// --- New ProductHighlight Component ---
const ProductHighlight = ({ icon, name, description, className }: { icon: React.ReactNode; name: string; description: string; className?: string }) => {
  return (
    <div className={clsx("hover:bg-muted dark:hover:bg-muted/50 space-y-2 rounded-lg border p-4 transition-colors h-full", className)}>
      <div className="flex size-fit items-center justify-center text-primary">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  )
}
// --- End ProductHighlight Component ---

// Make page component async and handle params promise
export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) { // Type params as Promise
  // Await the params promise to resolve
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch translations using getTranslations
  const t = await getTranslations('PricingPage');
  const tCommon = await getTranslations('common');
  const tProducts = await getTranslations('products');

  // Get pricing data for the current locale (for MAIN pricing section)
  const rawLocalePricing = pricingData[locale] || pricingData['sg'] || [];

  // Filter products based on commonData restrictions
  const localePricing = rawLocalePricing.filter(product => {
    // Find the corresponding product in commonData by matching title with name
    const commonProductKey = Object.keys(commonData.products).find(key => {
      const commonProduct = commonData.products[key]; // Access directly with string key
      return commonProduct.name === product.title;
    });

    if (commonProductKey) {
      const commonProduct = commonData.products[commonProductKey]; // Access directly
      // The check for commonProduct.excludedLocales handles its optional nature
      if (commonProduct.excludedLocales && commonProduct.excludedLocales.includes(locale)) {
        return false; // Exclude if locale is in excludedLocales
      }
    }
    return true; // Include by default or if not found in commonData (or no restrictions)
  });

  // Map product keys to icons (add new ones)
  const productIcons: { [key: string]: React.ReactNode } = {
    shop: <ShoppingCart className="size-6" />,
    reservation: <CalendarClock className="size-6" />,
    payment: <CreditCard className="size-6" />,
    loyalty: <Heart className="size-6" />,
    lounge: <Presentation className="size-6" />, // Key for Virtual Lounge
    survey: <ClipboardList className="size-6" />, // Key for Survey
    marketing: <Megaphone className="size-6" />, // Key for Marketing
    crm: <BrainCircuit className="size-6" />, // Key for CRM/Intelligence
    eats: <Network className="size-6" />, // Key for Oddle Eats
    default: <Check className="size-6" /> // Default fallback
  };

  // Get products from common.json for the HERO grid
  // Filter commonProductsArray based on excludedLocales
  const commonProductsArray = Object.entries(commonData.products || {})
    .filter(([, productDetails]) => {
      // productDetails is of type CommonProductDataEntry due to commonData typing
      if (productDetails.excludedLocales && productDetails.excludedLocales.includes(locale)) {
        return false; // Exclude if locale is in excludedLocales
      }
      return true; // Include by default or if no restrictions
    });

  return (
    <>
      <NavBar />
      <main className="flex-grow">
        {/* Reverted Hero Section (2-Column Layout) */}
        <Container className="relative overflow-hidden py-16 md:py-24">
          {/* Gradient Background Div */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 
                       bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-200/30 to-transparent 
                       dark:from-gray-800/30 dark:to-transparent"
          ></div>

          {/* Use 2-column grid layout */}
          <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
            {/* Left Column: Text Content & CTAs */}
            <div className="max-w-xl"> {/* Constrain width if needed */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                {t('heroTitle')}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                {t('heroSubtitle')}
              </p>
              {/* Updated CTA Buttons */}
              <div className="mt-10 flex items-center gap-x-4">
                {/* Request Demo Button */}
                <Button size="lg" asChild>
                  <Link href="/demo" prefetch={false}>
                    {tCommon('buttons.requestDemo')} {/* Keep buttons. prefix */}
                  </Link>
                </Button>
                {/* Talk to Sales Button */}
                <Button size="lg" variant="outline" asChild>
                  <ChatRedirectLink>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {tCommon('buttons.talkToSales')} {/* Keep buttons. prefix */}
                  </ChatRedirectLink>
                </Button>
              </div>
            </div>

            {/* Right Column: Product Grid */}
            {/* Removed order classes, removed mx-auto, potentially adjust mt */}
            <div className="mt-10 md:mt-0 pb-10 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
              {/* Max width set on the grid container itself if needed */}
              <div className="bg-background dark:bg-muted/50 rounded-2xl border p-3 shadow-lg md:pb-6 max-w-xl mx-auto md:mx-0"> {/* Keep max-width here, remove mx-auto on md */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Map over ALL commonProductsArray */}
                  {commonProductsArray.map(([key], index) => {
                    // Updated icon key inference logic
                    let finalIconKey = 'default';
                    const lowerKey = key.toLowerCase();
                    if (lowerKey.includes('order')) finalIconKey = 'shop';
                    else if (lowerKey.includes('reserv')) finalIconKey = 'reservation';
                    else if (lowerKey.includes('pay')) finalIconKey = 'payment';
                    else if (lowerKey.includes('loyal')) finalIconKey = 'loyalty';
                    else if (lowerKey.includes('lounge')) finalIconKey = 'lounge';
                    else if (lowerKey.includes('survey')) finalIconKey = 'survey';
                    else if (lowerKey.includes('marketing')) finalIconKey = 'marketing'; // Checks for marketing engine key
                    else if (lowerKey.includes('crm')) finalIconKey = 'crm'; // Checks for crm/intelligence key
                    else if (lowerKey.includes('eats')) finalIconKey = 'eats'; // Checks for oddle eats key

                    const totalProducts = commonProductsArray.length;
                    const isLastItemInSingleRow = index === totalProducts - 1 && totalProducts % 3 === 1;

                    return (
                      <ProductHighlight
                        key={key}
                        icon={productIcons[finalIconKey]}
                        name={tProducts(`${key}.title`)}
                        description={tProducts(`${key}.desc`, { defaultValue: '' })}
                        className={isLastItemInSingleRow ? 'col-span-3' : ''}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
        {/* === End Reverted Hero Section === */}

        {/* Main Pricing Section (Structure based on PostHog principles) */}
        <div className="p-6 md:p-8">
          <Container className="py-16 md:py-24">
            {/* Add relative positioning to the grid container */}
            <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-3">
              {/* Left Column: Explanations - Make sticky */}
              <div className="lg:col-span-1 prose dark:prose-invert max-w-none md:sticky top-24 h-fit">
                {/* How Pricing Works */}
                <h2 className="text-2xl font-semibold mb-4 not-prose">{t('explanationTitle')}</h2>
                <p className="mb-8">{t('explanationDesc1')}</p>
                <p className="mb-8">{t('explanationDesc2')}</p>

                {/* Free Tools Section */}
                <h3 className="text-xl font-semibold mb-3 not-prose">
                  {t('freeProductsTitle')}
                </h3>
                <p className="mb-3">
                  {t('freeProductsDesc')}
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>{t('productCrmTitle')}</li>
                  <li>{t('productVirtualLoungeTitle')}</li>
                  <li>{t('productSurveyTitle')}</li>
                </ul>
              </div>

              {/* Right Column: Product Pricing Details - Use localePricing */}
              <div className="lg:col-span-2 space-y-8">
                {localePricing.map((product, index) => (
                  <div key={index} className="bg-muted/50 dark:bg-gray-800/30 rounded-lg p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left Side: Details & Features */}
                      <div className="flex-1 prose dark:prose-invert max-w-none">
                        {/* Use direct title */}
                        <h3 className="not-prose text-xl font-medium mb-3">{product.title}</h3>
                        {/* Use direct description */}
                        <p>{product.description}</p>
                        <ul className="space-y-1 mt-4">
                          {product.features.map((featureText: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <Check className="mr-2 mt-1 h-4 w-4 text-primary flex-shrink-0" />
                              {/* Use direct feature text */}
                              <span>{featureText}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Right Side: Price & CTA - Increase width */}
                      <div className="md:w-1/3 flex flex-col items-end justify-between md:ml-auto">
                        <div className="text-right mb-4 md:mb-0 w-full">
                          {/* Use direct summaryPrice */}
                          <p className="text-xl font-bold text-primary">{product.summaryPrice}</p>
                          {/* Use direct priceUnit */}
                          <p className="text-sm text-muted-foreground">{product.priceUnit}</p>
                          {/* Helper renders details from JSON, passing t */}
                          {renderPricingDetails(product.details, tCommon)}
                        </div>
                        <Button
                          asChild
                          // Use specific type assertion for variant
                          variant={product.cta.variant as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' || 'default'}
                          className="w-full md:w-auto mt-4 md:mt-0"
                        >
                          {/* Use tCommon for CTA textKey */}
                          <Link href={product.cta.href}>{tCommon(product.cta.textKey)}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Pricing Calculator Section Placeholder */}

      </main>
      <Footer />
    </>
  );
}