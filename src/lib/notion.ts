import { Client } from "@notionhq/client";
// Remove import from unofficial client
// import { NotionAPI } from "notion-client"; 
// Import specific types from Notion SDK for better type safety
import type { 
    PageObjectResponse, 
    // QueryDatabaseResponse, // Removed unused import
    BlockObjectResponse,
    ListBlockChildrenResponse, // Import ListBlockChildrenResponse
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

// Add export keyword to the interface
export interface PostSummary {
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

// Define an extended block type that includes potential children
export type BlockWithChildren = BlockObjectResponse & {
  children?: BlockWithChildren[];
};

// Recursive function to fetch children for blocks that support it
async function fetchBlockChildrenRecursive(block: BlockWithChildren): Promise<void> {
  // Check if the block type can have children and if it has children according to Notion
  if (!block.has_children || !['column_list', 'column', 'bulleted_list_item', 'numbered_list_item', 'toggle', 'table'].includes(block.type)) {
    return; // No children to fetch for this type or this specific block doesn't have children
  }

  console.log(`Fetching children for block ID: ${block.id}, Type: ${block.type}`);
  try {
    let allChildren: BlockWithChildren[] = [];
    let start_cursor: string | undefined = undefined;

    // Paginate through children using blocks.children.list
    do {
      const response: ListBlockChildrenResponse = await notionClient.blocks.children.list({
        block_id: block.id,
        page_size: 100, // Adjust as needed
        start_cursor: start_cursor,
      });

      const childrenResults = response.results as BlockWithChildren[];
      allChildren = allChildren.concat(childrenResults);
      start_cursor = response.next_cursor ?? undefined;
      
    } while (start_cursor);

    console.log(`Fetched ${allChildren.length} children for block ID: ${block.id}`);
    
    // Recursively fetch grandchildren for each child
    await Promise.all(allChildren.map(child => fetchBlockChildrenRecursive(child)));

    // Attach the fetched children to the parent block
    block.children = allChildren;

  } catch (error) {
    console.error(`Failed to fetch children for block ${block.id}:`, error);
    // Decide how to handle errors, e.g., attach empty array or leave undefined
    block.children = []; 
  }
}

// TODO: Add function to get all published posts
// Modify function to accept locale
export async function getPublishedPosts(locale: string): Promise<Array<PostSummary & { slug: string }>> {
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set in environment variables.");
  }
  if (!locale) {
    console.warn("getPublishedPosts called without a locale, filtering might be incomplete.");
    // Decide fallback behavior: error out, or fetch all? Fetching all for now.
    // return []; // Or throw new Error("Locale is required");
  }

  console.log(`Attempting to query database ID: ${databaseId} for locale: ${locale}`); 

  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      // Update filter to include locale matching and published status
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            // OR condition for Country property
            or: [
              {
                // Condition 1: Country property is empty (global posts)
                property: "Country", // IMPORTANT: Ensure this matches your Notion property name
                select: {
                  is_empty: true,
                },
              },
              {
                // Condition 2: Country property equals the current locale
                property: "Country", // IMPORTANT: Ensure this matches your Notion property name
                select: {
                  equals: locale, // Match the passed locale
                },
              },
            ],
          },
        ],
      },
      sorts: [
        {
          property: "Publish Date", 
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

    console.log(`Fetched ${posts.length} posts for locale ${locale} (or global)`);
    return posts;

  } catch (error) {
    console.error(`Failed to fetch posts from Notion for locale ${locale}:`, error);
    return []; // Return empty array on error
  }
}

// Function to get a single post by slug
// Update return type to use BlockWithChildren
export async function getPostBySlug(slug: string): Promise<{ page: PageObjectResponse, blocks: BlockWithChildren[] } | null> {
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

    // 2. Fetch top-level blocks
    console.log(`Fetching initial blocks for page ID: ${pageId}`);
    let initialBlocks: BlockWithChildren[] = [];
    let start_cursor: string | undefined = undefined;
    do {
        const blocksResponse: ListBlockChildrenResponse = await notionClient.blocks.children.list({
            block_id: pageId,
            page_size: 100, 
            start_cursor: start_cursor,
        });
        initialBlocks = initialBlocks.concat(blocksResponse.results as BlockWithChildren[]);
        start_cursor = blocksResponse.next_cursor ?? undefined;
    } while (start_cursor);
    console.log(`Fetched ${initialBlocks.length} initial blocks.`);

    // 3. Recursively fetch children for each top-level block
    console.log(`Recursively fetching children for initial blocks...`);
    await Promise.all(initialBlocks.map(block => fetchBlockChildrenRecursive(block)));
    console.log(`Finished recursive fetching.`);

    // 4. Return page metadata and the blocks tree
    return { page, blocks: initialBlocks };

  } catch (error) {
    // Outer catch block handles errors 
    console.error(`Failed to fetch post data for slug "${slug}":`, error);
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
    }
    return null; // Return null on error
  }
} 