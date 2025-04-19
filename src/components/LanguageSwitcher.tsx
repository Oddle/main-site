"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLanguage = (newLocale: string) => {
    // Setting the cookie might still be useful for some server-side scenarios
    // or as a fallback, though next-intl primarily uses the URL.
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(pathname, { locale: newLocale });
    // router.refresh() might still be needed if you have Server Components
    // that depend on the locale and need immediate refreshing.
    // Consider if it's necessary for your use case.
    // router.refresh(); 
  };

  const localeDisplayMap: { [key: string]: string } = {
    en: "EN",
    zh: "CN",
    // Add other locales here -> ja: "JP" etc.
  };

  const currentDisplayCode = localeDisplayMap[currentLocale] || currentLocale.toUpperCase();

  return (
    <DropdownMenu dir={currentLocale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Globe className="h-4 w-4" />
          <span>{currentDisplayCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("zh")}>
          中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
