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

    let elementContent: React.ReactNode = plain_text;
    // Remove unused variable
    // let wrapperProps: React.HTMLAttributes<HTMLElement> = {};

    // Apply styling wrappers (innermost first)
    if (annotations.code) {
      elementContent = <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">{elementContent}</code>;
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
    
    // Apply link wrapper if href exists (outermost non-key wrapper)
    if (href) {
       return (
         <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 underline decoration-blue-700/50 dark:decoration-blue-400/50 hover:decoration-blue-900/50 dark:hover:decoration-blue-300/50 transition-colors duration-150">
           {elementContent}
         </a>
       );
    }
    
    // If no link, return the styled content within a Fragment or directly if it's a single element
    // Since elementContent could be nested, use a Fragment for safety
    return <React.Fragment key={index}>{elementContent}</React.Fragment>;
  });
}

// --- Block Rendering Logic (Extracted for Recursion) ---

// Define a type for the props of the single block renderer
interface RenderBlockProps {
  block: BlockWithChildren; // Use extended type
}

// Use React.ReactNode as return type
function RenderBlock({ block }: RenderBlockProps): React.ReactNode {
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
    default: {
      console.log(`Unsupported block type: ${type}`, block);
      return <div key={block.id} className="text-xs italic text-muted-foreground my-2">[Unsupported block type: {type}]</div>;
    }
  }
}

// --- Main PostRenderer Component (Simplified) ---
interface PostRendererProps {
  blocks: BlockWithChildren[]; // Use extended type
}

export function PostRenderer({ blocks }: PostRendererProps) {
  if (!blocks) return null;

  return (
    <div>
      {blocks.map((block) => <RenderBlock key={block.id} block={block} />)}
    </div>
  );
} 