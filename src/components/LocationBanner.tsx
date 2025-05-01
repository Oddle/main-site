// src/components/LocationBanner.tsx
"use client"; // Required for state and event handlers

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button

interface LocationBannerProps {
  detectedCountry: string; // e.g., MY
  currentLocale: string; // e.g., SG
  onDismiss: () => void; // Called when 'X' is clicked
  onSwitch: () => void; // Called when 'Switch' button is clicked
  isVisibleInitially?: boolean; // Controlled by parent component
}

const LocationBanner = ({
  detectedCountry,
  currentLocale,
  onDismiss,
  onSwitch,
  isVisibleInitially = true, // Default to visible if rendered
}: LocationBannerProps) => {
  const [isVisible, setIsVisible] = useState(isVisibleInitially);

  const handleClose = () => {
    setIsVisible(false);
    onDismiss(); // Notify parent component
  };

  const handleSwitch = () => {
    onSwitch(); // Notify parent component to perform switch action
  };

  if (!isVisible) return null;

  const title = `Location Suggestion`;
  const descriptionPart1 = `Looks like you might be in `;
  const descriptionPart2 = `, but you're viewing the `;
  const descriptionPart3 = ` site.`;

  return (
    <section
      className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-background px-4 py-3 shadow-md"
      role="status"
      aria-live="polite"
    >
      <div className="container mx-auto flex max-w-screen-lg items-center justify-between gap-4">
        <div className="flex-grow text-sm">
          <span className="font-semibold">{title}:</span>{' '}
          <span className="text-muted-foreground">
            {descriptionPart1}
            <strong className="text-foreground">{detectedCountry}</strong>
            {descriptionPart2}
            <strong className="text-foreground">
              {currentLocale.toUpperCase()}
            </strong>
            {descriptionPart3}
          </span>
        </div>

        <div className="flex flex-none items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSwitch}>
            Switch to {detectedCountry} site
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClose}
            aria-label="Dismiss location suggestion"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LocationBanner;