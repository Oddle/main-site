"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

// Read the logo URL from environment variable
const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/oddle-logo.svg";

// Define Product keys and categories
const productItems: { key: string; category: 'Acquire' | 'Build' | 'Convert' }[] = [
  { key: 'restaurant-reservation-system', category: 'Acquire', }, //t('reservation')
  { key: 'restaurant-online-ordering-system', category: 'Acquire' }, //t('online-ordering')
  { key: 'restaurant-loyalty-program', category: 'Acquire' },//t('loyalty')
  { key: 'restaurant-payment-terminal', category: 'Acquire' }, //t('payment-terminal')
  { key: 'restaurant-virtual-lounge', category: 'Build' }, //t('virtual-lounge')
  { key: 'restaurant-survey-tool', category: 'Build' }, //t('survey')
  { key: 'restaurant-email-marketing-system', category: 'Convert' }, //t('marketing-engine')
  { key: 'restaurant-crm-customer-intelligence', category: 'Convert' }, //t('customer-intelligence')
  { key: 'oddle-eats-network', category: 'Convert' }, //t('oddle-eats-network') 
];


// Define Resource keys
const resourceKeys: string[] = [
  "blog",
  "customerStories",
  "comparison",
  "aboutUs",
  "helpCenter",
];

export default function NavBar() {
  const t = useTranslations("NavBar");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
// i18next-parser Hint: Add full keys here so the parser can find them
// t('NavBar.products.restaurant-reservation-system.title');
// t('NavBar.products.restaurant-reservation-system.desc');
// t('NavBar.products.restaurant-online-ordering-system.title');
// t('NavBar.products.restaurant-online-ordering-system.desc');
// t('NavBar.products.restaurant-loyalty-crm-system.title');
// t('NavBar.products.restaurant-loyalty-crm-system.desc');
// t('NavBar.products.restaurant-payment-terminal.title');
// t('NavBar.products.restaurant-payment-terminal.desc');
// t('NavBar.products.restaurant-virtual-lounge.title');
// t('NavBar.products.virtual-lounge.desc');
// t('NavBar.products.restaurant-survey.title');
// t('NavBar.products.restaurant-survey.desc');
// t('NavBar.products.restaurant-email-marketing-system.title');
// t('NavBar.products.restaurant-email-marketing-system.desc');
// t('NavBar.products.restaurant-crm-customer-intelligence.title');
// t('NavBar.products.restaurant-crm-customer-intelligence.desc');
// t('NavBar.products.oddle-eats.title');
// t('NavBar.products.oddle-eats.desc');
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-[1440px] items-center px-4 md:px-6">
        {/* Logo */}
        <Link className="mr-6 flex items-center" href="/">
          <Image
            src={logoUrl}
            alt="Oddle Logo"
            width={80}
            height={32}
            priority
            className="h-8 w-auto"
          />
          <span className="sr-only">{t("pricing")}</span>
        </Link>

        {/* Main Desktop Navigation (Hidden on Mobile) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {/* Products Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>{t("product")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] p-4 md:w-[700px] md:grid-cols-3 lg:w-[800px]">
                  {/* Acquire Column */}
                  <div className="flex flex-col space-y-3 p-2">
                    <h4 className="text-sm font-medium leading-none text-muted-foreground px-3">{t("acquire")}</h4>
                    <ul className="space-y-1">
                      {productItems
                        .filter((p) => p.category === 'Acquire')
                        .map((product) => (
                          <ListItem
                            key={product.key}
                            title={t(`products.${product.key}.title`)}
                            href={`/products/${product.key}`}
                          >
                            {t(`products.${product.key}.desc`)}
                          </ListItem>
                        ))}
                    </ul>
                  </div>
                  {/* Build Column */}
                  <div className="flex flex-col space-y-3 p-2">
                    <h4 className="text-sm font-medium leading-none text-muted-foreground px-3">{t("build")}</h4>
                    <ul className="space-y-1">
                      {productItems
                        .filter((p) => p.category === 'Build')
                        .map((product) => (
                          <ListItem
                            key={product.key}
                            title={t(`products.${product.key}.title`)}
                            href={`/products/${product.key}`}
                          >
                            {t(`products.${product.key}.desc`)}
                          </ListItem>
                        ))}
                    </ul>
                  </div>
                  {/* Convert Column */}
                  <div className="flex flex-col space-y-3 p-2">
                    <h4 className="text-sm font-medium leading-none text-muted-foreground px-3">{t("convert")}</h4>
                    <ul className="space-y-1">
                      {productItems
                        .filter((p) => p.category === 'Convert')
                        .map((product) => (
                          <ListItem
                            key={product.key}
                            title={t(`products.${product.key}.title`)}
                            href={`/products/${product.key}`}
                          >
                            {t(`products.${product.key}.desc`)}
                          </ListItem>
                        ))}
                    </ul>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Resources Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>{t("resources")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/" // Placeholder link
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          {t("resourcesPromoTitle")}
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {t("resourcesPromoDesc")}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {/* Resource Links - Learn Column */}
                  {resourceKeys.slice(0, 3).map((key) => (
                    <ListItem
                      key={key}
                      href={`/resources/${key}`}
                      title={t(`resource.${key}.title`)}
                    />
                  ))}
                  {/* Resource Links - General Column */}
                  {resourceKeys.slice(3).map((key) => (
                    <ListItem
                      key={key}
                      href={`/resources/${key}`}
                      title={t(`resource.${key}.title`)}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Pricing Link */}
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {t("pricing")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right-aligned items */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Desktop Links (Hidden on Mobile) */}
          <nav className="hidden items-center space-x-2 md:flex">
            <Link
              href="/oddle-eats"
              passHref
              className={cn(navigationMenuTriggerStyle(), "hidden sm:inline-flex")}
            >
              {t("oddleEats")}
            </Link>
            <Link
              href="/login"
              passHref
              className={cn(navigationMenuTriggerStyle(), "hidden sm:inline-flex")}
            >
              {t("login")}
            </Link>
            <Button asChild size="sm">
              <Link href="/get-free-demo">{t("getFreeDemo")}</Link>
            </Button>
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Drawer */}
          <div className="md:hidden">
            <Drawer direction="bottom" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t("srOpenMenu")}</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="w-full max-h-[90vh]">
                <ScrollArea className="overflow-y-auto">
                  <DrawerHeader className="flex items-center justify-between p-4">
                    <DrawerTitle>
                      <span className="sr-only">{t("srMobileMenuTitle")}</span>
                    </DrawerTitle>
                  </DrawerHeader>

                  <div className="p-4 pt-0">
                    <div className="w-full space-y-4">
                      {/* Products Section */}
                      <div>
                        <h4 className="mb-2 text-base font-medium">{t("products")}</h4>
                        <div className="flex flex-col space-y-2 pl-4">
                          {productItems.map((product) => (
                            <Link
                              key={product.key}
                              href={`/products/${product.key}`}
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => setIsDrawerOpen(false)}
                            >
                              {t(`product.${product.key}.title`)}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Resources Section */}
                      <div>
                        <h4 className="mb-2 text-base font-medium">{t("resources")}</h4>
                        <div className="flex flex-col space-y-2 pl-4">
                          {resourceKeys.map((key) => (
                            <Link
                              key={key}
                              href={`/resources/${key}`}
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => setIsDrawerOpen(false)}
                            >
                              {t(`resource.${key}.title`)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col space-y-3">
                      <Link
                        href="/pricing"
                        className="text-base font-medium hover:text-foreground"
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        {t("pricing")}
                      </Link>
                      <Link
                        href="/oddle-eats"
                        className="text-base font-medium hover:text-foreground"
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        {t("oddleEats")}
                      </Link>
                      <Link
                        href="/login"
                        className="text-base font-medium hover:text-foreground"
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        {t("login")}
                      </Link>
                      <Button asChild className="w-full" onClick={() => setIsDrawerOpen(false)}>
                        <Link href="/get-free-demo">{t("getFreeDemo")}</Link>
                      </Button>
                      <div className="pt-4">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}

// ListItem Component (Helper for dropdowns)
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"; 