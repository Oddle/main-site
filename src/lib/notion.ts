import { Client } from "@notionhq/client";
// Remove import from unofficial client
// import { NotionAPI } from "notion-client"; 
// Import specific types from Notion SDK for better type safety
import type { 
    PageObjectResponse, 
    // QueryDatabaseResponse, // Removed unused import
    BlockObjectResponse,
    // Remove unused imports
    // RichTextItemResponse, 
    // MultiSelectPropertyItemObjectResponse 
} from "@notionhq/client/build/src/api-endpoints";
// Remove ExtendedRecordMap import
// import type { ExtendedRecordMap } from 'notion-types'; 

// Log partial token for verification
const token = process.env.NOTION_TOKEN;
console.log(`Using Notion Token starting with: ${token?.substring(0, 10)}... ending with: ${token?.substring(token.length - 4)}`);

// Initialize official Notion SDK client (for database queries)
export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

// REMOVE initialization of unofficial client
// export const notionAPI = new NotionAPI({
//   authToken: process.env.NOTION_TOKEN, 
//   activeUser: undefined,
// });

const databaseId = process.env.NOTION_DATABASE_ID!;

// Define the shape of the post summary object
interface PostSummary {
  id: string;
  slug: string | null;
  title: string;
  summary: string;
  publishDate: string | null;
  isFeatured?: boolean; // Add optional featured flag
  category?: string | null; // Added Category (Select type)
  thumbnailUrl?: string | null; // Added Thumbnail URL (URL or Text type)
  heroImageUrl?: string | null; // Added Hero Image URL (URL or Text type)
  readTime?: number | null; // Added Read Time (Number type)
}

// Type guard with parameter type
function isValidPostSummary(post: PostSummary | null): post is PostSummary & { slug: string } {
  return post !== null && typeof post.slug === 'string' && post.slug.length > 0;
}

// TODO: Add function to get all published posts
export async function getPublishedPosts(): Promise<Array<PostSummary & { slug: string }>> {
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set in environment variables.");
  }

  // Add log to verify the database ID being used
  console.log(`Attempting to query database with ID: ${databaseId}`); 

  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published", // Change if your property name is different
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Publish Date", // Change if your property name is different
          direction: "descending",
        },
      ],
    });

    const posts = response.results
      // Use PageObjectResponse directly or add type guard
      .map((page): PostSummary | null => {
        // Type guard to ensure it's a page object response
        if (!page || !('properties' in page)) { 
          return null; 
        }
        const typedPage = page as PageObjectResponse; // Assert type after check
        const properties = typedPage.properties as Record<string, PageObjectResponse['properties'][string]>;

        // Use optional chaining and nullish coalescing robustly
        const slug = (properties.Slug?.type === 'rich_text' ? properties.Slug.rich_text[0]?.plain_text : null) ?? null;
        const title = (properties.Title?.type === 'title' ? properties.Title.title[0]?.plain_text : "Untitled") ?? "Untitled";
        const summary = (properties.Summary?.type === 'rich_text' ? properties.Summary.rich_text[0]?.plain_text : "") ?? "";
        const publishDate = (properties["Publish Date"]?.type === 'date' ? properties["Publish Date"].date?.start : null) ?? null;
        // Extract the value of the "Featured" checkbox property
        const isFeatured = (properties.Featured?.type === 'checkbox' ? properties.Featured.checkbox : false) ?? false;
        // Extract Category (Select type)
        const category = (properties.Category?.type === 'select' ? properties.Category.select?.name : null) ?? null;
        // Extract Thumbnail URL (assuming URL type, fallback Text)
        const thumbnailUrl = (properties["Thumbnail URL"]?.type === 'url' ? properties["Thumbnail URL"].url : 
                           (properties["Thumbnail URL"]?.type === 'rich_text' ? properties["Thumbnail URL"].rich_text[0]?.plain_text : null)) ?? null;
        // Extract Hero Image URL (assuming URL type, fallback Text)
        const heroImageUrl = (properties["Hero Image URL"]?.type === 'url' ? properties["Hero Image URL"].url : 
                           (properties["Hero Image URL"]?.type === 'rich_text' ? properties["Hero Image URL"].rich_text[0]?.plain_text : null)) ?? null;
        // Extract Read Time (Number type)
        const readTime = (properties["Read Time"]?.type === 'number' ? properties["Read Time"].number : null) ?? null;

        return {
          id: typedPage.id, // Use typedPage here
          slug,
          title,
          summary,
          publishDate,
          isFeatured, // Include the featured status
          category, // Include category
          thumbnailUrl, // Include thumbnail URL
          heroImageUrl, // Include hero image URL
          readTime, // Include read time
        };
      })
      .filter(isValidPostSummary);

    return posts;
  } catch (error) {
    console.error("Failed to fetch posts from Notion:", error);
    // Depending on your error handling strategy, you might want to:
    // - return an empty array: return [];
    // - throw the error: throw error;
    // - return a specific error object
    return []; // Return empty array for now
  }
}

// Function to get a single post by slug
// Return type adjusted to include raw blocks
export async function getPostBySlug(slug: string): Promise<{ page: PageObjectResponse, blocks: BlockObjectResponse[] } | null> {
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set in environment variables.");
  }

  try {
    // 1. Find the page ID for the given slug (using official client)
    console.log(`Querying database for slug: ${slug}`);
    const response = await notionClient.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug", // Change if your property name is different
        rich_text: {
          equals: slug,
        },
      },
      page_size: 1, // We only expect one page for a unique slug
    });
    console.log(`Database query response for slug ${slug}:`, JSON.stringify(response)?.substring(0, 300) + "...");

    if (!response.results || response.results.length === 0) {
      console.warn(`No post found for slug: ${slug}`);
      return null;
    }

    // Ensure we have a PageObjectResponse
    const page = response.results[0] as PageObjectResponse;
    if (!page || !page.id) {
        console.warn(`Invalid page data received for slug: ${slug}`);
        return null;
    }
    const pageId = page.id;
    console.log(`Found page ID: ${pageId} for slug: ${slug}`);

    // 2. Fetch block children using the OFFICIAL client
    // Remove the inner try/catch around getPage call
    console.log(`Attempting to fetch blocks using notionClient.blocks.children.list for ID: ${pageId}`);
    const blocksResponse = await notionClient.blocks.children.list({
        block_id: pageId,
        page_size: 100, // Adjust page size as needed
    });
    const blocks = blocksResponse.results as BlockObjectResponse[];
    console.log(`Fetched ${blocks.length} blocks using official client.`);

    // Return page metadata and raw blocks
    return { page, blocks }; 

  } catch (error) {
    // Outer catch block handles errors 
    console.error(`Failed to fetch post data for slug "${slug}":`, error);
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
    }
    return null; // Return null on error
  }
} 