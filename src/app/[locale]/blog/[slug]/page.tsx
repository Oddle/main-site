import { getPublishedPosts, getPostBySlug } from "@/lib/notion";
import { notFound } from "next/navigation";
// import { PostRenderer } from "./PostRenderer"; // Moved to BlogContent
import { format } from 'date-fns';
import type { PageObjectResponse, BlockObjectResponse, ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
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
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar for author

// Revalidate the page periodically (optional)
// export const revalidate = 60; // Revalidate every 60 seconds

// Define Props type with params potentially being a Promise
// Even though the Page component usually receives resolved params,
// this typing satisfies Next.js build checks.
type PageProps = {
  params: Promise<{ slug: string; locale: string; }> | { slug: string; locale: string; };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Add if using searchParams
}

// Generate static paths for all published posts at build time
export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  // Ensure posts is an array before mapping
  if (!Array.isArray(posts)) {
    console.warn("generateStaticParams received non-array posts data, returning empty.");
    return [];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Define expected type for postData
type PostDataType = { page: PageObjectResponse, blocks: BlockObjectResponse[] } | null;

// Use the defined PageProps type
export default async function BlogPostPage({ params: paramsProp }: PageProps) {
  console.log("--- Rendering /blog/[slug] page ---");

  // Await the params object (works whether it's a promise or already resolved)
  const params = await paramsProp; 
  console.log("Awaited params:", params);

  // Access params.slug directly in the function call
  if (!params?.slug) { 
    console.error("Slug not found in awaited params object");
    notFound();
  }
  
  console.log(`Fetching data for slug: ${params.slug}`);
  const postData: PostDataType = await getPostBySlug(params.slug); 

  // Check for blocks
  if (!postData || !postData.blocks || !postData.page) {
    console.warn(`Post data, blocks, or page missing for slug: ${params.slug}.`);
    notFound(); 
  }

  // Destructure page and blocks
  const { page, blocks } = postData;

  // Use a more specific type assertion for properties
  const properties = page.properties as Record<string, PageObjectResponse['properties'][string]>;
  const title = (properties.Title?.type === 'title' ? properties.Title.title[0]?.plain_text : "Untitled") ?? "Untitled";
  const publishDate = (properties["Publish Date"]?.type === 'date' ? properties["Publish Date"].date?.start : null) ?? null;
  const summary = (properties.Summary?.type === 'rich_text' ? properties.Summary.rich_text[0]?.plain_text : null) ?? null;

  // Find the first image block to use as featured image
  const featuredImageBlock = blocks.find(block => block.type === 'image') as ImageBlockObjectResponse | undefined;
  const featuredImageUrl = featuredImageBlock?.image?.type === 'external' 
    ? featuredImageBlock.image.external.url 
    : featuredImageBlock?.image?.file?.url;
  // Filter out the featured image block from the main content blocks
  const contentBlocks = featuredImageBlock 
    ? blocks.filter(block => block.id !== featuredImageBlock.id)
    : blocks;

  // --- Remove Placeholder Author Data ---
  // const author = { ... };

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
            {/* Meta line (Date only for now) */}
            {publishDate && (
              <div className="mt-6 mb-8 text-sm text-muted-foreground">
                <span>{format(new Date(publishDate), "PPP")}</span>
              </div>
            )}

            {/* Featured Image */}
            {featuredImageUrl && (
              <div className="my-8 md:my-10 relative aspect-video overflow-hidden rounded-lg shadow-md">
                {/* Using next/image requires width/height, fill might work well here */}
                <Image 
                  src={featuredImageUrl} 
                  alt={title} // Use post title as alt text
                  fill 
                  className="object-cover" // Make image cover the container
                  priority // Prioritize loading the main image
                  sizes="(max-width: 1024px) 100vw, 75vw" // Help next/image optimize
                />
              </div>
            )}

            {/* Main Blog Content (passes filtered blocks) */}
            <BlogContent blocks={contentBlocks} />
          </div>

          {/* Right Column (TOC Only) */}
          <aside className="lg:col-span-1 mt-12 lg:mt-0">
            {/* Ensure correct sticky offset is applied */}
            <div className="sticky top-32 space-y-8">
              {/* Table of Contents */}
              <BlogTOC blocks={contentBlocks} />
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