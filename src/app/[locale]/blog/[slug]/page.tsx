import { getPublishedPosts, getPostBySlug /* , PostSummary */ } from "@/lib/notion";
import { notFound } from "next/navigation";
// import { PostRenderer } from "./PostRenderer"; // Moved to BlogContent
import { format } from 'date-fns';
import type { PageObjectResponse, BlockObjectResponse /* , ImageBlockObjectResponse */ } from "@notionhq/client/build/src/api-endpoints";
import { BlogContent } from "./BlogContent"; // New component for main content
import { BlogTOC } from "./BlogTOC"; // New component for Table of Contents
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // Import Breadcrumb components
import Link from "next/link"; // Needed for BreadcrumbLink
import React from 'react'; // Add React import
import Image from 'next/image'; // Import next/image
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported
import { Clock } from 'lucide-react'; // Import Clock icon for read time
import { routing } from "@/i18n/routing"; // Import routing config for locales
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar for author

// Revalidate the page periodically (optional)
// export const revalidate = 60; // Revalidate every 60 seconds

// Define Props type matching the internal Next.js expected type
type PageProps = {
  params: Promise<{ slug: string; locale: string; }> | undefined; // Match Promise<any> | undefined
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | undefined; 
}

// Generate static paths for all published posts across all locales
export async function generateStaticParams() {
  console.log("Generating static params for blog slugs...");
  const allParams: { locale: string; slug: string }[] = [];
  const uniquePostIdentifiers = new Set<string>(); // To avoid duplicates

  // Fetch posts for each locale concurrently
  await Promise.all(
    routing.locales.map(async (locale) => {
      
      // Ensure locale type matches expected type for getPublishedPosts if needed
      const posts = await getPublishedPosts(locale as typeof routing.locales[number]); 
      console.log(`Fetched ${posts.length} posts for locale: ${locale}`);
      console.log(`Fetching posts for locale: ${locale} in generateStaticParams`);
      posts.forEach((post) => {
        const identifier = `${locale}/${post.slug}`;
        if (!uniquePostIdentifiers.has(identifier)) {
          uniquePostIdentifiers.add(identifier);
          allParams.push({
            locale: locale,
            slug: post.slug,
          });
        }
      });
    })
  );

  console.log(`Generated ${allParams.length} unique locale/slug combinations.`);
  return allParams;
}

// Define expected type for postData
type PostDataType = { page: PageObjectResponse, blocks: BlockObjectResponse[] } | null;

// Use the defined PageProps type again
export default async function BlogPostPage({ params: paramsProp }: PageProps) {
  console.log("--- Rendering /blog/[slug] page ---");

  // Await the params object
  const params = await paramsProp as { slug: string; locale: string; }; 
  console.log("Awaited params:", params);

  // Runtime check for params structure (already added)
  if (typeof params !== 'object' || params === null || typeof params.slug !== 'string' || typeof params.locale !== 'string') {
    console.error("Invalid params structure after await:", params);
    notFound();
  }

  // Access params.slug directly in the function call
  if (!params?.slug) { 
    console.error("Slug not found in awaited params object");
    notFound();
  }
  
  console.log(`Fetching data for slug: ${params.slug}`);
  const postData: PostDataType = await getPostBySlug(params.slug); 

  if (!postData || !postData.blocks || !postData.page) {
    console.warn(`Post data, blocks, or page missing for slug: ${params.slug}.`);
    notFound(); 
  }

  // Destructure page and blocks
  const { page, blocks } = postData;

  // ----> ADD THIS LOG TO SEE THE RAW BLOCKS <----
  console.log("--- Raw Notion Blocks Data for slug:", params.slug, "---\n", JSON.stringify(blocks, null, 2)); // Pretty-print JSON
  // ---------------------------------------------

  // Extract properties using Record type for better safety
  const properties = page.properties as Record<string, PageObjectResponse['properties'][string]>;
  const title = (properties.Title?.type === 'title' ? properties.Title.title[0]?.plain_text : "Untitled") ?? "Untitled";
  const publishDate = (properties["Publish Date"]?.type === 'date' ? properties["Publish Date"].date?.start : null) ?? null;
  const summary = (properties.Summary?.type === 'rich_text' ? properties.Summary.rich_text[0]?.plain_text : null) ?? null;
  
  // Extract Hero Image URL directly from properties
  const heroImageUrl = (properties["Hero Image URL"]?.type === 'url' ? properties["Hero Image URL"].url : 
                      (properties["Hero Image URL"]?.type === 'rich_text' ? properties["Hero Image URL"].rich_text[0]?.plain_text : null)) ?? null;

  // Extract Category and Read Time
  const category = (properties.Category?.type === 'select' ? properties.Category.select?.name : null) ?? null;
  const readTime = (properties["Read Time"]?.type === 'number' ? properties["Read Time"].number : null) ?? null;

  // Prepare breadcrumb data (adjust paths as needed)
  const breadcrumbItems = [
    { href: "/", label: "Home" }, // Example Home link
    { href: `/${params.locale}/blog`, label: "Blog" }, // Link to blog index
    { label: title } // Current page (no href)
  ];

  return (
    <section className="w-full">
      {/* Add a wrapper div for max-width and centering */}
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs - Now inside the max-width wrapper */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />} 
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Two-column grid layout - Remove max-width/mx-auto from here */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12 xl:gap-x-16">
          
          {/* Left Column (Title, Meta, Image, Content) - Adjust to span 2 columns */}
          <div className="lg:col-span-2">
            {/* Category Badge */} 
            {category && (
              <div className="mb-4">
                <Badge variant="outline">{category}</Badge>
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
              {title}
            </h1>
            {/* Summary */}
            {summary && (
              <p className="mt-4 max-w-3xl text-lg text-muted-foreground text-balance">
                {summary}
              </p>
            )}
            {/* Meta line (Date and Read Time) */}
            {(publishDate || readTime) && (
              <div className="mt-6 mb-8 flex items-center gap-4 text-sm text-muted-foreground">
                {publishDate && (
                  <span>{format(new Date(publishDate), "MMM d, yyyy")}</span>
                )}
                {(publishDate && readTime) && (
                  <span className="mx-1">—</span> // Separator
                )}
                {readTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{readTime} min read</span>
                  </div>
                )}
              </div>
            )}

            {/* Featured Image - Use heroImageUrl from properties */}
            {heroImageUrl && (
              <div className="my-8 md:my-10 relative aspect-video overflow-hidden rounded-lg shadow-md">
                <Image 
                  src={heroImageUrl} // Use the property value
                  alt={title} 
                  fill 
                  className="object-cover" 
                  priority 
                  sizes="(max-width: 1024px) 100vw, 75vw" 
                />
              </div>
            )}

            {/* Main Blog Content - Pass the original blocks array */}
            <BlogContent blocks={blocks} />
          </div>

          {/* Right Column (TOC) - Pass the original blocks array */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="sticky top-32 space-y-8">
              <BlogTOC blocks={blocks} />
            </div>
          </aside>
        </div>
      </div> {/* End max-width wrapper */}
    </section>
  );
}

// Optional: Add metadata generation
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const postData = await getPostBySlug(params.slug);
//   if (!postData || !("properties" in postData.page)) {
//     return { title: 'Not Found' };
//   }
//   const properties = postData.page.properties as any;
//   const title = properties.Title?.title[0]?.plain_text ?? "Untitled";
//   const summary = properties.Summary?.rich_text[0]?.plain_text ?? "";
// 
//   return {
//     title: title,
//     description: summary,
//     // Add other metadata like open graph tags here
//   };
// } 