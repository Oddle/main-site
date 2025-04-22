import { getPublishedPosts } from "@/lib/notion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns"; // For formatting dates

// Optional: Add revalidation if needed
// export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogIndexPage() {
  console.log("--- Rendering /blog page ---");
  let posts;
  try {
    posts = await getPublishedPosts();
    console.log("Fetched posts:", posts);
  } catch (error) {
    console.error("Error fetching posts in /blog page:", error);
    // Optionally return an error message component here
    return <p>Error loading blog posts.</p>; 
  }

  if (!posts || posts.length === 0) {
    console.log("No posts found or posts array is empty.");
    return <p>No blog posts found.</p>;
  }

  console.log(`Rendering ${posts.length} posts.`);

  try {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} passHref legacyBehavior>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  {post.publishDate && (
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(post.publishDate), "PPP")} {/* Format: Jan 1, 2024 */}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{post.summary}</CardDescription>
                  {/* Optional: Display tags if you have them */}
                  {/* <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))} 
                  </div> */} 
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (renderError) {
      console.error("Error rendering the blog list:", renderError);
      return <p>Error displaying blog posts.</p>;
  }
} 