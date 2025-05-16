'use client';

import * as React from 'react';
// Import specific types for blocks and rich text
import type { 
    // BlockObjectResponse, // Removed unused
    RichTextItemResponse, 
    ParagraphBlockObjectResponse,
    Heading1BlockObjectResponse,
    Heading2BlockObjectResponse,
    Heading3BlockObjectResponse,
    ImageBlockObjectResponse,
    CodeBlockObjectResponse,
    BulletedListItemBlockObjectResponse,
    NumberedListItemBlockObjectResponse,
    QuoteBlockObjectResponse,
    TableBlockObjectResponse,
    TableRowBlockObjectResponse,
    // ColumnListBlockObjectResponse, // Removed unused 
    // ColumnBlockObjectResponse,     // Removed unused
} from "@notionhq/client/build/src/api-endpoints";
// Import the extended block type from notion lib
import type { BlockWithChildren } from "@/lib/notion"; 
// Import next/image
import Image from 'next/image'; 

// Remove NotionRenderer dynamic import and styles
// const NotionRenderer = dynamic(...);
// import 'react-notion-x/src/styles.css';
// import 'prismjs/themes/prism-tomorrow.css';
// import 'katex/dist/katex.min.css';

// --- Notion Color to Tailwind Mapping ---
const notionColorToTailwind: Record<string, string> = {
  // Text colors
  default: "", // No specific class for default
  gray: "text-gray-500 dark:text-gray-400",
  brown: "text-orange-800 dark:text-orange-300", // Using orange as substitute for brown
  orange: "text-orange-600 dark:text-orange-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  green: "text-green-600 dark:text-green-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  pink: "text-pink-600 dark:text-pink-400",
  red: "text-red-600 dark:text-red-400",
  // Background colors
  gray_background: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  brown_background: "bg-orange-100 dark:bg-orange-900/50 text-orange-900 dark:text-orange-200", // Using orange substitute
  orange_background: "bg-orange-100 dark:bg-orange-900/50 text-orange-900 dark:text-orange-200",
  yellow_background: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200",
  green_background: "bg-green-100 dark:bg-green-900/50 text-green-900 dark:text-green-200",
  blue_background: "bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200",
  purple_background: "bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200",
  pink_background: "bg-pink-100 dark:bg-pink-900/50 text-pink-900 dark:text-pink-200",
  red_background: "bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200",
};

// --- Helper function to generate a slug from text ---
function slugify(text: string): string {
  if (!text) return 'section'; // Default ID if text is empty
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[&/\#,+()$~%.'":*?<>{}]/g, '') // Remove special characters
    .replace(/--+/g, '-');          // Replace multiple - with single -
}

// --- Helper function to render rich text array ---
function renderRichText(richTextArr: RichTextItemResponse[]) {
  if (!richTextArr) return null;
  return richTextArr.map((richText, index) => {
    const rt = richText as Partial<RichTextItemResponse>; 
    const annotations = rt.annotations ?? { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' };
    const plain_text = rt.plain_text ?? '';
    const href = rt.href ?? null;
    const color = annotations.color ?? 'default'; // Get color annotation

    let elementContent: React.ReactNode = plain_text;

    // Apply styling wrappers (bold, italic, etc.) - Keep these innermost
    if (annotations.code) {
      elementContent = <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">{elementContent}</code>;
    }
    if (annotations.underline) {
      elementContent = <u>{elementContent}</u>;
    }
    if (annotations.strikethrough) {
      elementContent = <s>{elementContent}</s>;
    }
    if (annotations.italic) {
      elementContent = <em>{elementContent}</em>;
    }
    if (annotations.bold) {
      elementContent = <strong>{elementContent}</strong>;
    }
    
    // Apply color wrapper if not default - This wrapper goes around the style wrappers
    if (color !== 'default') {
      const tailwindClass = notionColorToTailwind[color];
      if (tailwindClass) {
        // For backgrounds, add some padding/rounding for better appearance
        const isBackground = color.endsWith('_background');
        const paddingClass = isBackground ? "px-1.5 py-0.5 rounded-sm" : ""; // Slightly more padding
        elementContent = <span className={`${tailwindClass} ${paddingClass}`}>{elementContent}</span>;
      }
    }

    // Apply link wrapper if href exists (outermost non-key wrapper)
    if (href) {
       return (
         <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 underline decoration-blue-700/50 dark:decoration-blue-400/50 hover:decoration-blue-900/50 dark:hover:decoration-blue-300/50 transition-colors duration-150">
           {elementContent}
         </a>
       );
    }
    
    return <React.Fragment key={index}>{elementContent}</React.Fragment>;
  });
}

// --- Block Rendering Logic (Extracted for Recursion) ---

// Define a type for the props of the single block renderer
interface RenderBlockProps {
  block: BlockWithChildren;
  isHeaderRow?: boolean; // Added optional prop for table rows
}

// Use React.ReactNode as return type
// Accept isHeaderRow in the function signature
function RenderBlock({ block, isHeaderRow }: RenderBlockProps): React.ReactNode {
  if (!('type' in block)) {
    return null; 
  }

  const type = block.type;
  const children = block.children; // Access potential children

  switch (type) {
    case 'paragraph': {
      const content = (block as ParagraphBlockObjectResponse).paragraph;
      if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
      return <p key={block.id} className="mb-4 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</p>;
    }
    case 'heading_1': {
      const content = (block as Heading1BlockObjectResponse).heading_1;
      if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
      const headingText = content.rich_text.map(rt => rt.plain_text).join('');
      return <h1 key={block.id} id={slugify(headingText)} className="text-3xl md:text-4xl font-bold mt-10 mb-5 border-b pb-3 scroll-mt-20">{renderRichText(content.rich_text)}</h1>; 
    }
    case 'heading_2': {
      const content = (block as Heading2BlockObjectResponse).heading_2;
      if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
      const headingText = content.rich_text.map(rt => rt.plain_text).join('');
      return <h2 key={block.id} id={slugify(headingText)} className="text-2xl md:text-3xl font-semibold mt-8 mb-4 scroll-mt-20">{renderRichText(content.rich_text)}</h2>; 
    }
    case 'heading_3': {
      const content = (block as Heading3BlockObjectResponse).heading_3;
      if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
      const headingText = content.rich_text.map(rt => rt.plain_text).join('');
      return <h3 key={block.id} id={slugify(headingText)} className="text-xl md:text-2xl font-semibold mt-6 mb-3 scroll-mt-20">{renderRichText(content.rich_text)}</h3>; 
    }
    case 'image': {
      const content = (block as ImageBlockObjectResponse).image;
      const src = content.type === 'external' ? content.external.url : content.file.url;
      const caption = content.caption?.length > 0 ? renderRichText(content.caption) : null;
      
      // Get image dimensions if available (Notion doesn't provide this easily for external URLs)
      // For simplicity, we'll rely on layout='responsive' or width/height attributes
      // Note: next/image with fill={true} requires a positioned parent.
      
      return (
        // Remove aspect-video, let the image define its aspect ratio.
        // Add relative positioning for fill={true} and caption positioning.
        <figure key={block.id} className="my-6 relative block"> 
          <Image 
            src={src} 
            // Use post title or a generic alt if caption is used for display
            alt={caption ? content.caption[0]?.plain_text ?? "Blog post image" : "Blog post image"} 
            // We need width/height or fill. Using fill requires parent to have dimensions.
            // Let's switch to width/height with layout responsive for now
            // We might need to fetch image dimensions separately for optimal performance/CLS
            // For now, set arbitrary width/height and allow responsive scaling.
            width={800} // Example width, adjust as needed or fetch dynamically
            height={450} // Example height based on 16:9, adjust or fetch
            layout="responsive" // Let image scale within container width
            className="object-cover rounded-md shadow-md block" // Ensure it's a block element
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
          />
          {caption && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                  {caption}
              </figcaption>
          )}
        </figure>
      );
    }
    case 'code': {
      const content = (block as CodeBlockObjectResponse).code;
      const codeText = content.rich_text?.map(rt => rt.plain_text).join('') ?? '';
      const language = content.language;
      return (
        <pre key={block.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4">
          <code className={`language-${language}`}>{codeText}</code>
        </pre>
      );
    }
    case 'bulleted_list_item': {
      const content = (block as BulletedListItemBlockObjectResponse).bulleted_list_item;
      if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
      return <li key={block.id} className="ml-4 mb-2 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</li>;
    }
    case 'numbered_list_item': {
      const content = (block as NumberedListItemBlockObjectResponse).numbered_list_item;
      if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
       return <li key={block.id} className="ml-4 mb-2 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</li>;
    }
    case 'column_list': {
      if (!children || children.length === 0) return null; 
      
      const numColumns = children.length;
      const gridClass = `grid grid-cols-1 md:grid-cols-${numColumns} gap-6 md:gap-8 my-6`;
      
      return (
        <div key={block.id} className={gridClass}>
          {children.map(col => <RenderBlock key={col.id} block={col} />)}
        </div>
      );
    }
    case 'column': {
      if (!children || children.length === 0) return null;
      
      return (
        <div key={block.id}>
          {children.map(childBlock => <RenderBlock key={childBlock.id} block={childBlock} />)}
        </div>
      );
    }
    case 'divider': {
      return <hr key={block.id} className="my-6 border-muted" />;
    }
    case 'quote': {
      const content = (block as QuoteBlockObjectResponse).quote;
      if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
      return (
        <blockquote key={block.id} className="my-6 border-l-4 border-muted pl-4 italic text-muted-foreground">
          {renderRichText(content.rich_text)}
        </blockquote>
      );
    }
    case 'table': {
      const tableSettings = (block as TableBlockObjectResponse).table;
      if (!children || children.length === 0) return null; // Table needs rows
      
      const hasHeader = tableSettings.has_column_header;
      const headerRow = hasHeader ? children[0] : null;
      const bodyRows = hasHeader ? children.slice(1) : children;
      
      return (
        <div key={block.id} className="my-6 overflow-x-auto relative shadow-sm rounded-lg border border-muted">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {headerRow && (
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                {/* Render the first row as header, passing isHeaderRow=true */} 
                <RenderBlock block={headerRow} isHeaderRow={true} /> 
              </thead>
            )}
            <tbody>
              {/* Render remaining rows as body */} 
              {bodyRows.map((row) => (
                <RenderBlock key={row.id} block={row} isHeaderRow={false} />
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'table_row': {
      const content = (block as TableRowBlockObjectResponse).table_row;
      if (!content?.cells || !Array.isArray(content.cells)) return null;
      
      // Render as tr, cells will be th or td based on isHeaderRow
      return (
        // Add background hover effect for body rows
        <tr 
          key={block.id} 
          className={isHeaderRow ? "" : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}
        >
          {content.cells.map((cell, cellIndex) => {
            // Check isHeaderRow to determine cell type
            if (isHeaderRow) {
              return (
                <th key={cellIndex} scope="col" className="px-6 py-3 font-medium whitespace-nowrap">
                  {renderRichText(cell)}
                </th>
              );
            } else {
              return (
                // Apply standard padding and scope for data cells
                <td key={cellIndex} className="px-6 py-4 align-top">
                  {renderRichText(cell)}
                </td>
              );
            }
          })}
        </tr>
      );
    }
    default: {
      return <div key={block.id} className="text-xs italic text-muted-foreground my-2">[Unsupported block type: {type}]</div>;
    }
  }
}

// --- Main PostRenderer Component (Corrected List Logic) ---
interface PostRendererProps {
  blocks: BlockWithChildren[];
}

export function PostRenderer({ blocks }: PostRendererProps) {
  if (!blocks) return null;

  const content: React.ReactNode[] = [];
  let listItemsBuffer: React.ReactNode[] = [];
  let currentListType: 'numbered' | 'bulleted' | null = null;

  blocks.forEach((block, index) => {
    const blockType = block.type;
    const isNumberedListItem = blockType === 'numbered_list_item';
    const isBulletedListItem = blockType === 'bulleted_list_item';
    const isListItem = isNumberedListItem || isBulletedListItem;
    const listTypeToStart = isNumberedListItem ? 'numbered' : isBulletedListItem ? 'bulleted' : null;

    if (isListItem && listTypeToStart) {
      // ---- Start or Continue a List ----
      if (currentListType !== listTypeToStart) {
        // If changing list type or starting fresh, first close any existing list
        if (currentListType === 'numbered') {
          // Use index for key when closing list due to type change
          content.push(<ol key={`ol-close-${index}`} className="list-decimal pl-8 my-4 space-y-1 text-gray-600 dark:text-gray-400">{listItemsBuffer}</ol>);
        } else if (currentListType === 'bulleted') {
          // Use index for key when closing list due to type change
          content.push(<ul key={`ul-close-${index}`} className="list-disc pl-8 my-4 space-y-1 text-gray-600 dark:text-gray-400">{listItemsBuffer}</ul>);
        }
        // Start a new buffer and set the type
        listItemsBuffer = [<RenderBlock key={block.id} block={block} />]; // Add the first item
        currentListType = listTypeToStart;
      } else {
        // Continue the current list: add item to buffer
        listItemsBuffer.push(<RenderBlock key={block.id} block={block} />);
      }
    } else {
      // ---- Not a List Item ----
      // First, close any list that was open
      if (currentListType === 'numbered') {
        // Use current block's id (which triggered the close) for key
        content.push(<ol key={`ol-close-${block.id}`} className="list-decimal pl-8 my-4 space-y-1 text-gray-600 dark:text-gray-400">{listItemsBuffer}</ol>);
      } else if (currentListType === 'bulleted') {
        // Use current block's id (which triggered the close) for key
        content.push(<ul key={`ul-close-${block.id}`} className="list-disc pl-8 my-4 space-y-1 text-gray-600 dark:text-gray-400">{listItemsBuffer}</ul>);
      }
      // Reset list state
      listItemsBuffer = [];
      currentListType = null;

      // Render the current non-list block
      content.push(<RenderBlock key={block.id} block={block} />);
    }
  });

  // After the loop, check if a list was still open and close it
  if (currentListType === 'numbered') {
    // Use length as part of key for final close
    content.push(<ol key={`ol-final-${blocks.length}`} className="list-decimal pl-8 my-4 space-y-1 text-gray-600 dark:text-gray-400">{listItemsBuffer}</ol>);
  } else if (currentListType === 'bulleted') {
    // Use length as part of key for final close
    content.push(<ul key={`ul-final-${blocks.length}`} className="list-disc pl-8 my-4 space-y-1 text-gray-600 dark:text-gray-400">{listItemsBuffer}</ul>);
  }

  // Keep the prose wrapper for overall styling, but be aware of potential list conflicts
  return <div className="prose dark:prose-invert max-w-none">{content}</div>;
} 