import { getPublishedPosts, PostSummary } from "@/lib/notion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns"; // For formatting dates
import React from 'react';
import Image from 'next/image'; // Import next/image
import { Button } from "@/components/ui/button"; // Import Button
import { Badge } from "@/components/ui/badge"; // Import Badge for category

// Define Props type
type PageProps = {
  params: Promise<{ locale: string; }> | { locale: string; };
}

// Optional: Add revalidation if needed
// export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogIndexPage({ params: paramsProp }: PageProps) {
  // Await and extract locale
  const params = await paramsProp as { locale: string; };
  const locale = params.locale;

  // Pass locale to getPublishedPosts and use PostSummary type
  const allPosts: PostSummary[] = await getPublishedPosts(locale);

  // Find the first featured post to use as the hero
  const heroPost = allPosts.find(post => post.isFeatured);
  
  // Change sidebarPosts to filter for *only* featured posts
  const sidebarPosts = allPosts.filter(post => post.isFeatured === true);

  // Get the latest 3 posts for the recent section
  const recentPosts = allPosts.slice(0, 3);

  // Get unique categories from all posts
  const uniqueCategories = Array.from(
    new Set(
      allPosts
        .map(post => post.category) // Extract categories
        .filter((category): category is string => typeof category === 'string' && category.length > 0) // Filter out null/empty and ensure type is string
    )
  ).sort(); // Sort alphabetically

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      {/* Add Title and Intro Section back */}
      <div className="mb-12 md:mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">Blog</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Insights, articles, and updates from our team. Explore the latest trends and ideas.
        </p>
      </div>

      {/* Main Grid Layout (Hero/Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 md:mb-24">
        {/* Hero Post (Left/Top) */}
        {heroPost && (
          <div className="lg:col-span-2">
            <article className="relative h-full w-full overflow-hidden rounded-lg shadow-lg group">
              {heroPost.heroImageUrl && (
                <Image 
                  src={heroPost.heroImageUrl} 
                  alt={heroPost.title} 
                  fill 
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" 
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              )}
              {/* Gradient Overlay */} 
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                {/* Optional Category for Hero */}
                {heroPost.category && (
                  <Badge variant="secondary" className="mb-2 bg-white/20 text-white backdrop-blur-sm border-none"> 
                    {heroPost.category}
                  </Badge>
                )}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                  <Link href={`/blog/${heroPost.slug}`} className="hover:underline focus:underline focus:outline-none">
                    {heroPost.title}
                  </Link>
                </h2>
                {heroPost.summary && (
                  <p className="mb-4 text-sm md:text-base text-gray-200 line-clamp-3 hidden sm:block">
                    {heroPost.summary}
                  </p>
                )}
                {/* Example Button */} 
                <Button asChild size="lg" variant="secondary" className="bg-white text-black hover:bg-gray-200">
                  <Link href={`/blog/${heroPost.slug}`}>Read More</Link>
                </Button>
              </div>
            </article>
          </div>
        )}

        {/* Sidebar Posts (Right/Bottom) */}
        {sidebarPosts.length > 0 && (
          <div className={heroPost ? "lg:col-span-1 space-y-6" : "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
            {/* Map the first 4 *featured* sidebar posts */} 
            {sidebarPosts.slice(0, 4).map((post) => (
              <div key={post.id} className={heroPost ? "pb-6 border-b last:border-b-0" : ""}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  {/* Conditional Rendering based on heroPost existence */} 
                  {heroPost ? (
                    // Vertical layout for sidebar when hero exists
                    <div className="flex items-start gap-4">
                      {(post.heroImageUrl || post.thumbnailUrl) && (
                        <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                          <Image 
                            src={post.heroImageUrl ?? post.thumbnailUrl!} // Prioritize hero, fallback to thumbnail
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        {post.category && <Badge variant="secondary" className="mb-1 text-xs">{post.category}</Badge>}
                        <h3 className="text-base font-semibold leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {(post.publishDate || post.readTime) && (
                          <p className="text-xs text-muted-foreground">
                            {post.publishDate && <span>{format(new Date(post.publishDate), "MMM d, yyyy")}</span>}
                            {(post.publishDate && post.readTime) && <span className="mx-1">—</span>}
                            {post.readTime && <span>{post.readTime} MIN READ</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Card layout when no hero exists (use structure from Recent Posts) 
                    <Card className={`h-full flex flex-col ${ 
                      post.heroImageUrl || post.thumbnailUrl ? 'pt-0' : '' // Only add pt-0 if image exists
                    } overflow-hidden rounded-lg border shadow-sm transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
                      {(post.heroImageUrl || post.thumbnailUrl) && (
                        <div className="relative w-full aspect-video overflow-hidden">
                           <Image 
                            src={post.heroImageUrl ?? post.thumbnailUrl!} // Prioritize hero, fallback to thumbnail
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <CardHeader>
                        {post.category && <Badge variant="secondary" className="mb-2 text-xs w-fit">{post.category}</Badge>}
                        <CardTitle className="text-lg lg:text-xl group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <CardDescription className="mb-3 line-clamp-3 text-sm">
                          {post.summary ?? ''}
                        </CardDescription>
                        {(post.publishDate || post.readTime) && (
                          <p className="text-xs text-muted-foreground">
                            {post.publishDate && <span>{format(new Date(post.publishDate), "MMM d, yyyy")}</span>}
                            {(post.publishDate && post.readTime) && <span className="mx-1"> - </span>}
                            {post.readTime && <span>{post.readTime} MIN READ</span>}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 border-b pb-3">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                <Card className={`h-full flex flex-col ${ 
                  post.heroImageUrl || post.thumbnailUrl ? 'pt-0' : '' // Only add pt-0 if image exists
                } overflow-hidden rounded-lg border shadow-sm transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
                  {(post.heroImageUrl || post.thumbnailUrl) && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image 
                        src={post.heroImageUrl ?? post.thumbnailUrl!} // Prioritize hero, fallback to thumbnail
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardHeader>
                    {post.category && (
                      <Badge variant="outline" className="mb-2 text-xs w-fit">{post.category}</Badge>
                    )}
                    <CardTitle className="text-lg lg:text-xl group-hover:text-primary transition-colors">
                       {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="mb-3 line-clamp-3 text-sm">
                       {post.summary ?? ''} {/* Display summary if available */}
                    </CardDescription>
                    {(post.publishDate || post.readTime) && (
                       <p className="text-xs text-muted-foreground">
                         {post.publishDate && <span>{format(new Date(post.publishDate), "MMM d, yyyy")}</span>}
                         {(post.publishDate && post.readTime) && <span className="mx-1">—</span>}
                         {post.readTime && <span>{post.readTime} MIN READ</span>}
                       </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Explore Topics Section (Moved Below Recent Posts) */}
      {uniqueCategories.length > 0 && (
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 border-b pb-3">Explore Topics</h2>
          <div className="flex flex-wrap gap-3">
            {uniqueCategories.map((category: string) => (
              <Link key={category} href={`/blog/tag/${encodeURIComponent(category.toLowerCase())}`} className="no-underline">
                <Badge variant="secondary" className="px-4 py-2 text-sm cursor-pointer hover:bg-muted/80">
                  {category}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
} 