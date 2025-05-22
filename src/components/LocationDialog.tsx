"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LocationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void; // Handles closing via overlay/esc
  detectedCountry: string; // e.g., MY
  currentLocale: string; // e.g., SG
  supportedLocales: readonly string[]; // All locales like ['sg', 'my', 'hk']
  onConfirm: (selectedLocale: string) => void; // Called when confirm is clicked
  onDismiss: () => void; // Called when dismiss/cancel is clicked
}

// Optional: Simple mapping for display names (enhance as needed)
const localeDisplayNames: Record<string, string> = {
  en: "Global",
  sg: "Singapore",
  my: "Malaysia",
  hk: "Hong Kong",
  tw: "Taiwan",
  au: "Australia",
  // Add other locales as needed based on your routing.locales
};

const LocationDialog = ({
  isOpen,
  onOpenChange,
  detectedCountry,
  currentLocale,
  supportedLocales,
  onConfirm,
  onDismiss,
}: LocationDialogProps) => {
  // State to hold the currently selected value in the dropdown
  const [selectedLocale, setSelectedLocale] = useState<string>('');

  // Set default selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Default to detected country if supported, otherwise current locale
      const lowerDetected = detectedCountry.toLowerCase();
      if (supportedLocales.includes(lowerDetected)) {
        setSelectedLocale(lowerDetected);
      } else {
        setSelectedLocale(currentLocale.toLowerCase());
      }
    }
  }, [isOpen, detectedCountry, currentLocale, supportedLocales]);

  const handleConfirm = () => {
    if (selectedLocale) {
      onConfirm(selectedLocale); // Pass the selected locale code
    }
  };

  const handleDismiss = () => {
    onDismiss(); // Notify parent for session tracking
    onOpenChange(false); // Close the dialog
  };

  // Handle closing via overlay/esc/X button
  // Treat closing without confirm as a dismiss for session tracking
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        onDismiss();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Region & Language Setting</DialogTitle>
          <DialogDescription>
            We detected you might be in{' '}
            <strong>{localeDisplayNames[detectedCountry.toLowerCase()] || detectedCountry}</strong>.
            Please select your preferred region/language for the best experience.
            You are currently viewing the{' '}
            <strong>{localeDisplayNames[currentLocale.toLowerCase()] || currentLocale.toUpperCase()}</strong> site.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select value={selectedLocale} onValueChange={setSelectedLocale}>
            <SelectTrigger className="w-full" aria-label="Select your region and language">
              <SelectValue placeholder="Select your region/language" />
            </SelectTrigger>
            <SelectContent>
              {supportedLocales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {/* Display mapped name or uppercase locale code */}
                  {localeDisplayNames[locale] || locale.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          {/* Use a more descriptive dismiss button text */}
          <Button variant="outline" onClick={handleDismiss}>
            Maybe Later
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedLocale}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog; 