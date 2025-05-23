import { getPublishedPosts, PostSummary } from "@/lib/notion";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import React from 'react'; // Import React
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // Import Breadcrumb components
import { Separator } from "@/components/ui/separator"; // Import Separator
import { Clock } from 'lucide-react'; // Import Clock icon

import type { Metadata } from 'next'; // Import Metadata type
import { generatePageMetadata } from '@/lib/metadataUtils'; // Import the metadata helper

// Define Props type matching the internal Next.js expected type
// Params should be Promise | undefined
type PageProps = {
  params: Promise<{ category: string; locale: string; }> | undefined; // Correct type: Promise or undefined
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | undefined; 
}

// Function to get the display name (capitalized)
function getCategoryDisplayName(slug: string): string {
    try {
        // Replace hyphens with spaces
        const spacedName = slug.replace(/-/g, ' ');
        // Capitalize first letter of each word
        const capitalizedName = spacedName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return capitalizedName;
    } catch (e) {
        console.error("Error processing category slug:", e);
        return slug; // Fallback to original slug if processing fails
    }
}

// Optional: Generate static paths if you know all categories beforehand
// export async function generateStaticParams() {
//   const allPosts = await getPublishedPosts();
//   const uniqueCategories = Array.from(
//     new Set(
//       allPosts
//         .map(post => post.category)
//         .filter((category): category is string => typeof category === 'string' && category.length > 0)
//         .map(category => encodeURIComponent(category.toLowerCase())) // Ensure they match the link format
//     )
//   );
//   return uniqueCategories.map(category => ({ category }));
// }

// Generate metadata for the Blog Category page
export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<{ locale: string; category: string }> }
): Promise<Metadata> {
  const params = await paramsPromise;
  return generatePageMetadata({
    locale: params.locale,
    pageKey: `blog/topics/${params.category}`,
    slug: params.category // Pass category as slug for potential use in title/desc fallbacks
  });
}

// Use the correct PageProps type and await params
export default async function CategoryTagPage({ params: paramsProp }: PageProps) {
  // Await and extract locale and category
  const params = await paramsProp as { category: string; locale: string; }; 
  const locale = params.locale; // Extract locale
  const categorySlug = params.category;
  
  // Runtime check for params structure
  if (typeof params !== 'object' || params === null || typeof params.category !== 'string' || typeof params.locale !== 'string') {
    console.error("Invalid params structure received in CategoryTagPage:", params);
    return <p>Error: Invalid page parameters.</p>; 
  }

  const categoryDisplayName = getCategoryDisplayName(categorySlug);
  
  // 1. Fetch initial posts for the current locale (includes global)
  const initialLocalePosts: PostSummary[] = await getPublishedPosts(locale);

  // 2. Filter by category (compare hyphenated slugs)
  let postsToDisplay = initialLocalePosts.filter(post => 
    post.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );

  // 3. Check if empty and not already the default locale
  if (postsToDisplay.length === 0 && locale !== 'sg') {
    // 4. Fetch fallback posts from default locale ('sg')
    const fallbackSgPosts: PostSummary[] = await getPublishedPosts('sg');
    
    // 5. Filter fallback posts by the same category (compare hyphenated slugs)
    postsToDisplay = fallbackSgPosts.filter(post => 
      post.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug
    );
  }

  // Prepare breadcrumb data
  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: `/blog`, label: "Blog" }, 
    { label: categoryDisplayName }
  ];

  // 6. Render using the final postsToDisplay list
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      {/* Breadcrumbs - Use shadcn component */}
      <Breadcrumb className="mb-8 flex justify-center">
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

      {/* Centered Header Section (like main blog page) */}
      <div className="text-center mb-16 md:mb-20 lg:mb-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
          {categoryDisplayName}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Exploring posts related to {categoryDisplayName}. Find the latest insights and articles on this topic.
        </p>
      </div>

      {/* Posts List Section */}
      {postsToDisplay.length > 0 ? (
        <div className="space-y-8 md:space-y-12">
          {postsToDisplay.map((post, index) => (
            <React.Fragment key={post.id}>
              <article className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
                {/* Thumbnail (Prioritize Hero Image) */}
                {(post.heroImageUrl || post.thumbnailUrl) && (
                  <Link href={`/blog/${post.slug}`} className="block flex-shrink-0 w-full sm:w-48 md:w-64 aspect-video relative overflow-hidden rounded-md group">
                    <Image 
                      src={post.heroImageUrl ?? post.thumbnailUrl!} // Use hero if available, else thumbnail
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                  </Link>
                )}
                {/* Content Details */}
                <div className="flex-grow">
                  {/* Category and Date */} 
                  <div className="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
                    {/* Use categoryDisplayName from the page context as it's consistent */}
                    <Badge variant="secondary">{categoryDisplayName}</Badge>
                    {post.publishDate && (
                       <span>{format(new Date(post.publishDate), "MMMM d, yyyy")}</span>
                    )}
                  </div>
                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  {/* Author (Placeholder if added later) and Read Time */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {/* Add Author here if available */} 
                    {post.readTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min read</span>
                      </div>
                    )}
                  </div>
                  {/* Read More Link */}
                  <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                    Read More &rarr;
                  </Link>
                </div>
              </article>
              {/* Separator (don't add after the last item) */} 
              {index < postsToDisplay.length - 1 && <Separator className="my-8 md:my-12" />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No posts found for the category &quot;{categoryDisplayName}&quot; in this region or globally.
          </p>
        </div>
      )}
    </div>
  );
} 