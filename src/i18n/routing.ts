import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["sg", "hk", "my", "tw", "au"],

  // Used when no locale matches
  defaultLocale: "sg",
  localeDetection: true,
  //to remove the locale prefix from the url
  localePrefix: "as-needed",
});
