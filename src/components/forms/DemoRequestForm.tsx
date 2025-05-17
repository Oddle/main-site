"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
// Assuming you might want the phone input again
import PhoneInputWithCountrySelect from 'react-phone-number-input/react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import styles for phone input
import { Loader2, MessageSquare } from "lucide-react"; // For loading/success state and MessageSquare
import ChatRedirectLink from "@/components/common/ChatRedirectLink"; // Import the chat link

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Declare fbq as a global function for TypeScript
declare global {
  interface Window {
    // Use unknown[] instead of any[] for better type safety
    fbq?: (...args: unknown[]) => void;
  }
}

// Helper function to get cookie by name
const getCookieValue = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return undefined;
};

interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_id?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  page_url?: string; 
}

const getAttributionDataFromCookie = (): AttributionData => {
  const cookieValue = getCookieValue("attribution_data");
  if (cookieValue) {
    try {
      const decodedValue = decodeURIComponent(cookieValue);
      const parsedData = JSON.parse(decodedValue) as Partial<AttributionData>; // Use Partial for safety

      // Ensure page_url and referrer from cookie are either valid-like URLs or undefined
      // so they don't interfere with Zod .url() validation if they are junk strings.
      const output: AttributionData = { ...parsedData };

      if (parsedData.page_url && typeof parsedData.page_url === 'string' && 
          !parsedData.page_url.startsWith('http://') && 
          !parsedData.page_url.startsWith('https://')) {
        output.page_url = undefined; // Or "", to let Zod handle it, but undefined allows fallback better
      }
      if (parsedData.referrer && typeof parsedData.referrer === 'string' && 
          !parsedData.referrer.startsWith('http://') && 
          !parsedData.referrer.startsWith('https://')) {
        output.referrer = undefined;
      }

      return output;
    } catch (error) {
      console.error("Error parsing attribution_data cookie:", error);
      return {};
    }
  }
  return {};
};

// Updated Zod schema
const formSchema = z.object({
  role: z.string().min(1, { message: "Please select your role." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string()
           .refine(value => !value || isValidPhoneNumber(value), { message: 'Invalid phone number' })
           .or(z.literal('')), // Allow empty or valid
  email: z.string().email({ message: "Invalid email address." }),
  restaurantName: z.string().min(1, { message: "Restaurant name is required." }),
  website: z.string().optional(),
  source: z.string().min(1, { message: "Please select how you heard about us." }),
  // New fields for webhook - updated schema for URL fields
  currentUrl: z.string().url({message: "Invalid current URL"}).optional().or(z.literal('')),
  pageUrl: z.string().url({message: "Invalid page URL"}).optional().or(z.literal('')),
  referrer: z.string().url({message: "Invalid referrer URL"}).optional().or(z.literal('')),
  // UTM parameters from cookies
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_id: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DemoRequestFormProps {
  i18nBaseKey: string; // e.g., "demoPage.form"
}

export default function DemoRequestForm({ i18nBaseKey }: DemoRequestFormProps) {
  const t = useTranslations(i18nBaseKey);
  const tCommonButtons = useTranslations('common.buttons'); // For common button text
  const tSalesSection = useTranslations('common.forms.demoRequest'); // For the talk to sales section
  const locale = useLocale(); // Get current locale
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const localeToPhonePrefix: Record<string, string> = {
    sg: '+65',
    tw: '+886',
    hk: '+852',
    en: '+1',
    my: '+60',
  };
  const defaultPhonePrefix = localeToPhonePrefix[locale] || '';

  const localeToCountryCode: Record<string, string> = {
    sg: 'SG',
    tw: 'TW',
    hk: 'HK',
    en: 'US', // Default for 'en'
    my: 'MY',
  };
  const currentCountryCode = localeToCountryCode[locale] || 'SG'; // Fallback to 'SG' or your primary default

  const initialAttributionData = getAttributionDataFromCookie();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      phone: defaultPhonePrefix, // Set locale-based default phone prefix
      email: "",
      restaurantName: "",
      website: "",
      source: "",
      currentUrl: "", // Will be populated by onSubmit using window.location.href
      pageUrl: initialAttributionData.page_url || (typeof document !== 'undefined' ? document.referrer : "") || "",
      referrer: initialAttributionData.referrer || (typeof document !== 'undefined' ? document.referrer : "") || "",
      // UTM Parameters from cookies
      utm_source: initialAttributionData.utm_source || "",
      utm_campaign: initialAttributionData.utm_campaign || "",
      utm_medium: initialAttributionData.utm_medium || "",
      utm_id: initialAttributionData.utm_id || "",
      utm_content: initialAttributionData.utm_content || "",
      utm_term: initialAttributionData.utm_term || "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;

  // Type helper for the options
  type TranslationOptions = Record<string, string>;

  // Function to safely get options
  const getOptionsFromRaw = (key: string): TranslationOptions => {
    const rawValue: unknown = t.raw(key); 
    if (typeof rawValue === 'object' && rawValue !== null && !Array.isArray(rawValue)) {
      return rawValue as TranslationOptions;
    }
    return {};
  };

  const roleOptions = getOptionsFromRaw('roleOptions');
  const sourceOptions = getOptionsFromRaw('sourceOptions');

  async function onSubmit(values: FormData) {
    setIsSubmitSuccessful(false);

    // Auto-prefix website URL if needed
    let processedWebsite = values.website;
    if (processedWebsite && 
        !processedWebsite.startsWith('http://') && 
        !processedWebsite.startsWith('https://')) {
      processedWebsite = 'https://' + processedWebsite;
    }

    // Prepare data to send to the API
    const dataToSend = {
      ...values,
      website: processedWebsite, // Use the processed website URL
      currentUrl: typeof window !== 'undefined' ? window.location.href : "", // Capture current URL at submission time
      pageUrl: values.pageUrl,                 // Use captured pageUrl
      referrer: values.referrer,        // Use captured initialReferrer
    };

    // --- Trigger Facebook Pixel Lead Event --- 
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead');
        console.log("Facebook Pixel: Lead event triggered for DemoRequestForm.");
      } catch (error) {
        console.error("Error triggering Facebook Pixel event:", error);
      }
    } else {
      console.log("Facebook Pixel function (fbq) not found on window object.");
    }
    // -------------------------------------------

    try {
      const response = await fetch('/api/submit-demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Send enriched data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred during submission." }));
        console.error("Submission Error:", errorData);
        toast.error(errorData.message || t('submitError') || "Failed to submit request. Please try again.");
        setIsSubmitSuccessful(false);
        return; // Stop further execution on error
      }

      // const responseData = await response.json(); // If you need to use response data
      toast.success(t('submitSuccess') || "Demo requested successfully!");
      setIsSubmitSuccessful(true);

    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(t('submitError') || "Failed to submit request. Please try again.");
      setIsSubmitSuccessful(false);
    }
  }

  const handleResetFormForNewSubmission = () => {
    setIsSubmitSuccessful(false); // Allow new submissions
    const newAttributionData = getAttributionDataFromCookie();
    reset({ // Reset form to default values
      role: "",
      firstName: "",
      lastName: "",
      phone: defaultPhonePrefix, // Reset with locale-based prefix
      email: "",
      restaurantName: "",
      website: "",
      source: "",
      currentUrl: "", 
      pageUrl: newAttributionData.page_url || (typeof document !== 'undefined' ? document.referrer : "") || "",
      referrer: newAttributionData.referrer || (typeof document !== 'undefined' ? document.referrer : "") || "",
      // Reset UTM parameters by re-reading from cookies
      utm_source: newAttributionData.utm_source || "",
      utm_campaign: newAttributionData.utm_campaign || "",
      utm_medium: newAttributionData.utm_medium || "",
      utm_id: newAttributionData.utm_id || "",
      utm_content: newAttributionData.utm_content || "",
      utm_term: newAttributionData.utm_term || "",
    });
  };

  return (
    <div className="relative w-full rounded-xl border border-border bg-background p-6 py-10 shadow-sm">
      <h3 className="mb-6 text-xl font-semibold text-center">{t('title')}</h3>
    <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role Select */}
        <FormField
          control={form.control}
          name="role"
            render={({ field }) => (
            <FormItem>
                {/* <FormLabel>{t('roleLabel')}</FormLabel> */}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('rolePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(roleOptions).map(([key, label]: [string, string]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* First & Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
              render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{t('firstNameLabel')}</FormLabel> */}
                <FormControl>
                  <Input placeholder={t('firstNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
              render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{t('lastNameLabel')}</FormLabel> */}
                <FormControl>
                  <Input placeholder={t('lastNamePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

          {/* Phone Input */}
        <FormField
          control={form.control}
          name="phone"
            render={({ field }) => (
            <FormItem>
              {/* <FormLabel>{t('phoneLabel')}</FormLabel> */}
              <FormControl>
                <PhoneInputWithCountrySelect
                  international
                  countryCallingCodeEditable={false}
                  country={currentCountryCode} // Explicitly set country for flag
                  placeholder={t('phonePlaceholder')}
                  {...field} // Spread field props
                  // Apply Tailwind classes for styling consistency
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Input */}
        <FormField
          control={form.control}
          name="email"
            render={({ field }) => (
            <FormItem>
              {/* <FormLabel>{t('emailLabel')}</FormLabel> */}
              <FormControl>
                <Input type="email" placeholder={t('emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Restaurant Name Input */}
        <FormField
          control={form.control}
          name="restaurantName"
            render={({ field }) => (
            <FormItem>
              {/* <FormLabel>{t('restaurantNameLabel')}</FormLabel> */}
              <FormControl>
                <Input placeholder={t('restaurantNamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Restaurant Website Input */}
        <FormField
          control={form.control}
          name="website"
            render={({ field }) => (
            <FormItem>
              {/* <FormLabel>{t('websiteLabel')}</FormLabel> */}
              <FormControl>
                <Input placeholder={t('websitePlaceholder')} {...field} />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
        />

        {/* Source Select */}
        <FormField
          control={form.control}
          name="source"
            render={({ field }) => (
            <FormItem>
              {/* <FormLabel>{t('sourceLabel')}</FormLabel> */}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('sourcePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   {Object.entries(sourceOptions).map(([key, label]: [string, string]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Consent Text */}
          <div className="text-xs text-muted-foreground pt-2">
           {t.rich('consent', {
               terms: (chunks) => <Link href="/terms-of-service" className="underline">{chunks}</Link>,
               privacy: (chunks) => <Link href="/privacy-policy" className="underline">{chunks}</Link>,
           })}
          </div>

        {isSubmitSuccessful ? (
          <div className="text-center space-y-4"> {/* Container for success message and button */}
            <p className="text-green-600 font-semibold"> {/* Success message styling */}
              {t('submitSuccessShort') || 'Submitted!'}
            </p>
            <Button 
              type="button" 
              className="w-full cursor-pointer"
              onClick={handleResetFormForNewSubmission}
            >
              {t('submitAnotherButtonText') || 'Submit Another Response'} 
            </Button>
          </div>
        ) : (
          <Button 
            type="submit" 
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   {t('submitting') || 'Booking...'}
              </>
            ) : (
                 t('submitButtonText') || 'Book demo'
            )}
          </Button>
        )}

      </form>
    </Form>

    {/* Talk to Sales Section */}
    <div className="mt-12 pt-8 border-t border-border text-center">
      <h4 className="text-lg font-semibold mb-2">
        {tSalesSection('talkToSalesSectionTitle') || "Got Questions? Let's Chat!"}
      </h4>
      <p className="text-muted-foreground mb-6 text-sm">
        {tSalesSection('talkToSalesSectionDescription') || "Have a few questions before booking a demo? Drop us a message and we'll help you out."}
      </p>
      <Button variant="outline" size="lg" asChild>
        <ChatRedirectLink>
          <MessageSquare className="mr-2 h-4 w-4" />
          {tCommonButtons('talkToSales') || 'Talk to Sales'}
        </ChatRedirectLink>
      </Button>
    </div>

    </div>
  );
} 