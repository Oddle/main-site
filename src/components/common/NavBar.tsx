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
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // --- Transform data from common.json ---
  const transformData = (): NavLink[] => {
    const productsByCategory: { [key: string]: NavItem[] } = {};

    // Group products by category
    for (const [key, product] of Object.entries(commonData.products || {})) {
      const category = product.category || 'uncategorized'; // Default category
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push({
        key: key,
        href: product.href,
        name: tProducts(`${key}.title`),
        description: tProducts(`${key}.desc`),
      });
    }

    const productCategories: NavCategory[] = Object.entries(productsByCategory).map(
      ([categoryLabel, items]) => ({
        label: categoryLabel,
        items: items,
      })
    );

    // Use Object.values() to iterate over links object
    const resourceItems: NavItem[] = Object.values(commonData.links || {}) // Get array of link values
      .filter(link => link.href.startsWith('/resources/')) // Filter the array
      .map((link, index) => ({
          key: link.href || `resource-${index}`,
          href: link.href,
          name: link.name,
          description: link.description
      }));

    // Use Object.values() to find links
    const pricingLink = Object.values(commonData.links || {}).find(link => link.href === '/pricing');
    const exploreOddleLink = Object.values(commonData.links || {}).find(link => link.href === '/');

    const constructedNavLinks: NavLink[] = [
      // Product Menu
      {
        label: 'products',
        isMegaMenu: true,
        categories: productCategories,
      },
      // Resources Menu
      {
        label: 'resources',
        isMegaMenu: true,
        promo: exploreOddleLink ? {
            title: exploreOddleLink.name,
            description: exploreOddleLink.description || '',
            href: exploreOddleLink.href,
        } : undefined,
        items: resourceItems,
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
                <p className="font-medium text-muted-foreground px-2">{tNav(`links.${link.label}`)}</p>
                {link.categories.map(category => (
                  <div key={category.label} className="ml-2 grid gap-1">
                    <p className="text-sm font-medium text-muted-foreground/80 px-2">{tNav(category.label)}</p>
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
                 <p className="font-medium text-muted-foreground px-2">{tNav(`links.${link.label}`)}</p>
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
              } else if (link.isMegaMenu && link.promo && link.items) { // Resources Menu
                return (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuTrigger>{tNav(`links.${link.label}`)}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href={link.promo.href}
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                {link.promo.title}
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                {link.promo.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        {link.items.map((item) => {
                          // Use item.name directly
                          return (
                            <ListItem
                              key={item.key}
                              href={item.href}
                              title={item.name}
                            >
                              {item.description}
                            </ListItem>
                          );
                        })}
                      </ul>
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
                <DrawerTitle>{tNav("mobileTitle")}</DrawerTitle>
              </DrawerHeader>
              <DrawerLinks />
              {/* Mobile Action Buttons inside Drawer Footer */}
              <div className="mt-auto p-4 border-t grid grid-cols-3 gap-2">
                  <Link href="#" passHref legacyBehavior>
                     <Button variant="outline" className="w-full" asChild onClick={() => setIsDrawerOpen(false)}><a>{tNav('links.oddleEats')}</a></Button>
                  </Link>
                  <Link href="#" passHref legacyBehavior>
                     <Button variant="outline" className="w-full" asChild onClick={() => setIsDrawerOpen(false)}><a>{tNav('links.login')}</a></Button>
                  </Link>
                  <Link href="#" passHref legacyBehavior>
                     <Button className="w-full" onClick={() => setIsDrawerOpen(false)}>{tNav('links.getFreeDemo')}</Button>
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
          href={href}
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