"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
// Assuming you might want the phone input again
import PhoneInputWithCountrySelect from 'react-phone-number-input/react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import styles for phone input

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react"; // For loading/success state
import { useState } from 'react'; // For success state

// Revert Zod schema to original fields
const formSchema = z.object({
  role: z.string().min(1, { message: "Please select your role." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  phone: z.string()
           .refine(value => !value || isValidPhoneNumber(value), { message: 'Invalid phone number' })
           .or(z.literal('')), // Allow empty or valid
  email: z.string().email({ message: "Invalid email address." }),
  restaurantName: z.string().min(1, { message: "Restaurant name is required." }),
  website: z.string().optional(), // Optional
  source: z.string().min(1, { message: "Please select how you heard about us." }),
});

type FormData = z.infer<typeof formSchema>;

interface DemoRequestFormProps {
  i18nBaseKey: string; // e.g., "demoPage.form"
}

export default function DemoRequestForm({ i18nBaseKey }: DemoRequestFormProps) {
  const t = useTranslations(i18nBaseKey);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // Revert default values
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      restaurantName: "",
      website: "",
      source: "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;

  // Get options from translations
  const roleOptions = t.raw('roleOptions');
  const sourceOptions = t.raw('sourceOptions');

  async function onSubmit(values: FormData) {
    setIsSubmitSuccessful(false);
    console.log("Form Submitted:", values);
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    try {
      // --- Your API call logic here --- 
      toast.success(t('submitSuccess') || "Demo requested successfully!");
      setIsSubmitSuccessful(true);
      // Reset might not be needed if you show a permanent success message
      // reset(); 
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(t('submitError') || "Failed to submit request. Please try again.");
      setIsSubmitSuccessful(false);
    }
  }

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
                    {Object.entries(roleOptions).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label as string}</SelectItem>
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
                     {Object.entries(sourceOptions).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label as string}</SelectItem>
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

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isSubmitSuccessful}
          >
             {isSubmitSuccessful ? ( // Check success state first
               <>
                 <Check className="mr-2 h-4 w-4" /> 
                 {t('submitSuccessShort') || 'Submitted!'} 
               </>
             ) : isSubmitting ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 {t('submitting') || 'Booking...'}
               </>
             ) : (
               t('submitButtonText') || 'Book demo'
             )}
           </Button>

        </form>
      </Form>
    </div>
  );
} 