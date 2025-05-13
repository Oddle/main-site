"use client";

import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations('LanguageSwitcher');

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
    sg: "SG",
    tw: "台湾",
    my: "Malaysia",
    hk: "Hong Kong",
    au: "Australia"
    // Add other locales here -> ja: "JP" etc.
  };

  const currentDisplayCode = localeDisplayMap[currentLocale] || currentLocale.toUpperCase();

  return (
    <DropdownMenu dir={currentLocale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5"
          aria-label={t('changeLanguageLabel')}
        >
          <Globe className="h-4 w-4" />
          <span>{currentDisplayCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("sg")}>
          Singapore
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("tw")}>
          台湾
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("my")}>
          Malaysia
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("hk")}>
          Hong Kong
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("au")}>
          Australia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
