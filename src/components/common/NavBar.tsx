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
// Import and type commonData
import commonJson from "@/data/common.json";

// --- Define Types for Navbar Data Structure ---
interface NavItem {
  key: string;
  href: string;
  name: string;
  description?: string;
}

interface NavCategory {
  label: string;
  items: NavItem[];
}

interface NavPromo {
  title: string;
  description: string;
  href: string;
}

interface NavLink {
  label: string;
  href?: string;
  isMegaMenu?: boolean;
  categories?: NavCategory[];
  promo?: NavPromo;
  items?: NavItem[];
}

// --- Interfaces from common.json (needed for typing) ---
interface AddressData {
  entityName?: string;
  country: string;
  address: string;
}

interface ProductData {
  name: string;
  description?: string;
  href: string;
  category?: string;
}

interface CommonLinkData {
    name: string;
    description?: string;
    href: string;
    category?: string;
}

interface CommonData {
    products?: { [key: string]: ProductData };
    addresses?: { [key: string]: AddressData };
    // Define links as an object map
    links?: { [key: string]: CommonLinkData };
}

// Type the imported common data
const commonData: CommonData = commonJson;

// Read the logo URL from environment variable
const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/oddle-logo.svg";

// Helper function to extract key from resource href is no longer needed for translation
// const getResourceKeyFromHref = ...

export default function NavBar() {
  const tNav = useTranslations("navbar"); // Use navbar namespace for structure
  const tProducts = useTranslations("products"); // Get product translations
  const tResources = useTranslations("resources"); // Use resources namespace for structure
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // --- Transform data from common.json ---
  const transformData = (): NavLink[] => {
    const productsByCategory: { [key: string]: NavItem[] } = {};
    const resourcesByCategory: { [key: string]: NavItem[] } = {}; // Group resources by category

    // Group products by category
    for (const [key, product] of Object.entries(commonData.products || {})) {
      const category = product.category || 'uncategorized'; // Default category
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push({
        key: key,
        href: product.href,
        name: tProducts(`${key}.title`), // Use specific product translations
        description: tProducts(`${key}.desc`),
      });
    }

    // Group resource links by category
    for (const [key, link] of Object.entries(commonData.links || {})) {
        // Ensure the link belongs in the resources section and has a category
        if (link.href.startsWith('/resources/') && link.category && (link.category === 'learn' || link.category === 'general')) {
            if (!resourcesByCategory[link.category]) {
                resourcesByCategory[link.category] = [];
            }
            // Use the category from the JSON data
            resourcesByCategory[link.category].push({
                key: key, // Use the original key from common.json
                href: link.href,
                // Translate resource names, letting next-intl handle defaults
                name: tResources(`${key}.title`) ?? link.name,
                description: tResources(`${key}.desc`) ?? link.description ?? '',
            });
        }
    }

    const productCategories: NavCategory[] = Object.entries(productsByCategory).map(
      ([categoryLabel, items]) => ({
        label: categoryLabel, // This might need translation prefix later if needed
        items: items,
      })
    );

    // Create resource categories array
    const resourceCategories: NavCategory[] = Object.entries(resourcesByCategory).map(
      ([categoryLabel, items]) => ({
        label: categoryLabel, // e.g., "learn", "general" - these will be translated via tNav later
        items: items,
      })
    );

    // Find specific links for promo and top-level items
    const pricingLink = Object.values(commonData.links || {}).find(link => link.href === '/pricing');
    // Find the influencer list promo link
    const influencerPromoLink = commonData.links ? commonData.links['singapore-influencer-list'] : undefined;

    const constructedNavLinks: NavLink[] = [
      // Product Menu
      {
        label: 'products',
        isMegaMenu: true,
        categories: productCategories,
      },
      // Resources Menu - Now uses categories and specific promo
      {
        label: 'resources',
        isMegaMenu: true,
        // Use the specific promo link if found
        promo: influencerPromoLink ? {
            // Translate promo title and description, letting next-intl handle defaults
            title: tResources('singapore-influencer-list.title') ?? influencerPromoLink.name,
            description: tResources('singapore-influencer-list.desc') ?? influencerPromoLink.description ?? '',
            href: influencerPromoLink.href,
        } : undefined,
        categories: resourceCategories,
      },
    ];

    // Pricing Link
    if (pricingLink) {
      constructedNavLinks.push({
        label: 'pricing',
        href: pricingLink.href
      });
    }

    return constructedNavLinks;
  };

  const navLinks = transformData();
  // --- End Data Transformation ---

  // getTranslationPrefix helper is removed

  // --- Mobile Drawer Content (Use direct data for items) ---
  const DrawerLinks = () => (
    <ScrollArea className="flex-1 p-4">
      <nav className="grid gap-2">
        {navLinks.map((link) => {
          if (link.isMegaMenu && link.categories) { // Product Menu
            return (
              <div key={link.label} className="grid gap-1">
                <p className="font-medium text-muted-foreground px-2 py-1">{tNav(`links.${link.label}`)}</p>
                {link.categories.map(category => (
                  <div key={category.label} className="ml-2 grid gap-1">
                    <p className="text-sm font-medium text-muted-foreground/80 px-2 py-1">{tNav(category.label)}</p>
                    {category.items.map(item => {
                      // Use item.name directly, key is for React
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          className="group flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {item.name} {/* Display already translated name */}
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            );
          } else if (link.isMegaMenu && link.items) { // Resources Menu
            return (
              <div key={link.label} className="grid gap-1">
                 <p className="font-medium text-muted-foreground px-2 py-1">{tNav(`links.${link.label}`)}</p>
                 {link.items.map(item => {
                    // Use item.name directly
                    return (
                       <Link
                          key={item.key}
                          href={item.href}
                          className="group flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsDrawerOpen(false)}
                       >
                          {item.name} {/* Display already translated name */}
                       </Link>
                    )
                 })}
              </div>
            )
          } else if (link.href) { // Simple Link (Pricing)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center rounded-md px-3 py-2 font-medium hover:bg-accent"
                onClick={() => setIsDrawerOpen(false)}
              >
                {tNav(`links.${link.label}`)}
              </Link>
            );
          } else {
            return null;
          }
        })}
      </nav>
    </ScrollArea>
  );

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
          <span className="sr-only">Oddle</span>
        </Link>

        {/* Main Desktop Navigation (Hidden on Mobile) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => {
              if (link.isMegaMenu && link.categories) { // Product Menu
                return (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuTrigger>{tNav(`links.${link.label}`)}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] p-4 md:w-[700px] md:grid-cols-3 lg:w-[800px]">
                        {link.categories.map(category => (
                          <div key={category.label} className="flex flex-col space-y-3 p-2">
                            <h4 className="text-sm font-medium leading-none text-muted-foreground px-3">{tNav(category.label)}</h4>
                            <ul className="space-y-1">
                              {category.items.map((item) => {
                                // Use item.name and item.description directly
                                return (
                                  <ListItem
                                    key={item.key}
                                    title={item.name}
                                    href={item.href}
                                  >
                                    {item.description}
                                  </ListItem>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              } else if (link.isMegaMenu && link.promo && link.categories) { // Resources Menu
                return (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuTrigger>{tNav(`links.${link.label}`)}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {link.categories.map((category) => (
                          <div key={category.label} className="flex flex-col">
                            <p className="text-sm font-medium leading-none text-muted-foreground px-2 py-1.5">{tNav(category.label)}</p>
                            <div className="flex flex-col">
                              {category.items.map((item) => (
                                <ListItem key={item.key} href={item.href} title={item.name}>
                                  {item.description}
                                </ListItem>
                              ))}
                            </div>
                          </div>
                        ))}
                        {link.promo && (
                          <div className="col-span-full row-start-1 flex flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md md:col-span-1 md:row-start-auto">
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {link.promo.title}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {link.promo.description}
                            </p>
                            <Link href={link.promo.href} className="mt-4 text-sm font-medium text-primary underline underline-offset-4">
                              Get Access →
                            </Link>
                          </div>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              } else if (link.href) { // Simple Link (Pricing)
                return (
                  <NavigationMenuItem key={link.label}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {tNav(`links.${link.label}`)}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              } else {
                return null;
              }
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions (Language Switcher & Mobile Drawer Trigger) */}
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          {/* Desktop Action Buttons */}
          <Link href="#" passHref legacyBehavior>
             <Button variant="ghost" asChild className="hidden md:inline-flex"><a>{tNav('links.oddle-eats')}</a></Button>
          </Link>
           <Link href="#" passHref legacyBehavior>
             <Button variant="ghost" asChild className="hidden md:inline-flex"><a>{tNav('links.login')}</a></Button>
          </Link>
           <Link href="#" passHref legacyBehavior>
             <Button className="hidden md:inline-flex">{tNav('links.get-free-demo')}</Button>
          </Link>

          <LanguageSwitcher />

          {/* Mobile Drawer Trigger (Visible only on Mobile) */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80%] flex flex-col">
              <DrawerHeader>
                <DrawerTitle></DrawerTitle>
              </DrawerHeader>
              <DrawerLinks />
              {/* Mobile Action Buttons inside Drawer Footer */}
              <div className="mt-auto p-4 border-t grid grid-cols-3 gap-2">
                  <Link href="#" passHref legacyBehavior>
                     <Button variant="outline" className="w-full" asChild onClick={() => setIsDrawerOpen(false)}><a>{tNav('links.oddle-eats')}</a></Button>
                  </Link>
                  <Link href="#" passHref legacyBehavior>
                     <Button variant="outline" className="w-full" asChild onClick={() => setIsDrawerOpen(false)}><a>{tNav('links.login')}</a></Button>
                  </Link>
                  <Link href="#" passHref legacyBehavior>
                     <Button className="w-full" onClick={() => setIsDrawerOpen(false)}>{tNav('links.get-free-demo')}</Button>
                  </Link>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

// --- ListItem Component Modified Again ---
// Omit conflicting props from base anchor attributes before adding our own
interface ListItemProps extends Omit<React.ComponentPropsWithoutRef<"a">, 'title' | 'children'> {
  title: React.ReactNode; // Our custom title prop accepting ReactNode
  children?: React.ReactNode; // Our custom children prop accepting ReactNode
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  ListItemProps // Use the updated interface
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        {/* Pass standard anchor props (excluding title/children), use custom props for display */}
        <a
          ref={ref}
          href={href || '#'} // Ensure href is always defined or provide a fallback
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props} // Spread remaining compatible props
          // Optionally add standard title attribute only if our title is a string
          title={typeof title === 'string' ? title : undefined}
        >
          <div className="text-sm font-medium leading-none">{title /* Render our ReactNode title */}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children /* Render our ReactNode children */}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"; 