"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
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
});

type FormData = z.infer<typeof formSchema>;

interface DemoRequestFormProps {
  i18nBaseKey: string; // e.g., "demoPage.form"
}

export default function DemoRequestForm({ i18nBaseKey }: DemoRequestFormProps) {
  const t = useTranslations(i18nBaseKey);
  const tCommonButtons = useTranslations('common.buttons'); // For common button text
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [initialReferrer, setInitialReferrer] = useState('');

  useEffect(() => {
    // Capture document.referrer when the component mounts
    // This is the URL of the page that linked to the current page (where the form is)
    setPageUrl(document.referrer); 
    // For 'referrer' (original source like google.com), document.referrer on mount is a common starting point.
    // True original referrer tracking across a session is more complex (e.g. using localStorage/cookies on first site visit).
    setInitialReferrer(document.referrer);
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      restaurantName: "",
      website: "",
      source: "",
      currentUrl: "", // Will be populated on submit
      pageUrl: "",    // Will be populated from state
      referrer: "",   // Will be populated from state
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue, // Added setValue
  } = form;

  // Update defaultValues for pageUrl and initialReferrer once captured
  useEffect(() => {
    if (pageUrl) setValue('pageUrl', pageUrl);
    if (initialReferrer) setValue('referrer', initialReferrer);
  }, [pageUrl, initialReferrer, setValue]);

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

    // Prepare data to send to the API
    const dataToSend = {
      ...values,
      currentUrl: window.location.href, // Capture current URL at submission time
      pageUrl: pageUrl,                 // Use captured pageUrl
      referrer: initialReferrer,        // Use captured initialReferrer
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
      // reset({ // Reset with initial values including dynamically set ones if needed
      //       role: "",
      //       firstName: "",
      //       lastName: "",
      //       phone: "",
      //       email: "",
      //       restaurantName: "",
      //       website: "",
      //       source: "",
      //       currentUrl: "", 
      //       pageUrl: "", // Reset these as well
      //       referrer: "",
      // }); 
      // Consider also resetting pageUrl and initialReferrer states if form can be re-submitted without page reload
      // setPageUrl(''); 
      // setInitialReferrer('');

    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(t('submitError') || "Failed to submit request. Please try again.");
      setIsSubmitSuccessful(false);
    }
  }

  const handleResetFormForNewSubmission = () => {
    setIsSubmitSuccessful(false); // Allow new submissions
    reset({ // Reset form to default values
      role: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      restaurantName: "",
      website: "",
      source: "",
      currentUrl: "", 
      pageUrl: "",
      referrer: "",
    });
    // Re-capture referrer for the new submission
    const currentReferrer = document.referrer;
    setPageUrl(currentReferrer);
    setInitialReferrer(currentReferrer);
    // The useEffect listening to pageUrl/initialReferrer will update form values
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      defaultCountry="SG" // Or determine dynamically
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <Button 
            type="button" 
            className="w-full cursor-pointer"
            onClick={handleResetFormForNewSubmission}
          >
            {t('submitAnotherButtonText') || 'Submit Another Response'} 
          </Button>
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
        {t('talkToSalesSectionTitle') || "Got Questions? Let\'s Chat!"}
      </h4>
      <p className="text-muted-foreground mb-6 text-sm">
        {t('talkToSalesSectionDescription') || "Have a few questions before booking a demo? Drop us a message and we\'ll help you out."}
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