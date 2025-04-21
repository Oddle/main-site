'use client';

import * as React from 'react';
// Remove react-notion-x imports
// import dynamic from 'next/dynamic';
// import type { ExtendedRecordMap } from 'notion-types';
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Image from 'next/image'; // Import next/image

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
function renderRichText(richTextArr: any[]) {
  return richTextArr.map((richText, index) => {
    const { annotations, plain_text, href } = richText;
    let element = <React.Fragment key={index}>{plain_text}</React.Fragment>;

    // Basic annotation handling
    if (annotations.bold) element = <strong>{element}</strong>;
    if (annotations.italic) element = <em>{element}</em>;
    if (annotations.strikethrough) element = <s>{element}</s>;
    if (annotations.underline) element = <u>{element}</u>;
    // Add Tailwind classes for inline code 
    if (annotations.code) element = <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">{element}</code>; 

    // Add refined Tailwind classes for links
    if (href) element = <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 underline decoration-blue-700/50 dark:decoration-blue-400/50 hover:decoration-blue-900/50 dark:hover:decoration-blue-300/50 transition-colors duration-150">{element}</a>;

    return element;
  });
}

// --- Main Renderer Component ---

interface PostRendererProps {
  // Accept raw blocks from the official API
  blocks: BlockObjectResponse[];
}

export function PostRenderer({ blocks }: PostRendererProps) {
  if (!blocks) {
    return null;
  }

  // Wrap output; applying prose class in parent (BlogPostPage) is recommended
  return (
    <div>
      {blocks.map((block) => {
        if (!('type' in block)) {
          console.warn("Block missing type:", block);
          return null; 
        }
        
        const type = block.type;
        const content = (block as any)[type]; 
        let headingText = ''; // Variable to store heading text for ID generation

        switch (type) {
          case 'paragraph':
            if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
            // Apply specific text color, overriding prose default
            return <p key={block.id} className="mb-6 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</p>;
          
          case 'heading_1':
            if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
            headingText = content.rich_text.map((rt: any) => rt.plain_text).join('');
            return <h1 key={block.id} id={slugify(headingText)} className="text-2xl md:text-2xl font-bold mt-10 mb-5 border-b pb-3 scroll-mt-20">{renderRichText(content.rich_text)}</h1>;
            
          case 'heading_2':
            if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
            headingText = content.rich_text.map((rt: any) => rt.plain_text).join('');
            return <h2 key={block.id} id={slugify(headingText)} className="text-xl md:text-xl font-semibold mt-8 mb-4 scroll-mt-20">{renderRichText(content.rich_text)}</h2>;
            
          case 'heading_3':
            if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
            headingText = content.rich_text.map((rt: any) => rt.plain_text).join('');
            return <h3 key={block.id} id={slugify(headingText)} className="text-lg md:text-lg font-semibold mt-6 mb-3 scroll-mt-20">{renderRichText(content.rich_text)}</h3>;

          // --- Handle Images ---
          case 'image':
            const src = content.type === 'external' ? content.external.url : content.file.url;
            const caption = content.caption?.length > 0 ? renderRichText(content.caption) : null;
            // Basic image rendering. Consider width/height/alt from Notion if available
            // Using next/image requires width and height. For now, let's use a standard img tag
            // or set fixed dimensions for next/image. Let's use standard img for simplicity first.
            return (
              <figure key={block.id} className="my-4">
                {/* Option 1: Standard img tag */}
                <img src={src} alt={caption ? "Image caption" : "Blog post image"} className="max-w-full h-auto rounded-md shadow-md" />
                
                {/* Option 2: next/image (Requires figuring out dimensions) */}
                {/* <Image 
                  src={src} 
                  alt={caption ? "Image caption" : "Blog post image"} 
                  width={700} // Example width - needs proper handling
                  height={400} // Example height - needs proper handling
                  className="rounded-md shadow-md"
                /> */} 
                
                {caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{caption}</figcaption>}
              </figure>
            );

          // --- Handle Code Blocks ---
          case 'code':
            const codeText = content.rich_text?.map((rt: any) => rt.plain_text).join('') ?? '';
            const language = content.language;
            // Basic code block styling. Syntax highlighting needs a library (e.g., highlight.js, prismjs, refractor).
            return (
              <pre key={block.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4">
                <code className={`language-${language}`}>{codeText}</code>
              </pre>
            );

          // --- List Item Handling (Basic) ---
          case 'bulleted_list_item':
            if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
            // Apply text color and keep basic margin
            return <li key={block.id} className="ml-4 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</li>;

          case 'numbered_list_item':
             if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
             // Apply text color and keep basic margin
             return <li key={block.id} className="ml-4 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</li>;

          default:
            console.log(`Unsupported block type: ${type}`, block);
            // Render unsupported blocks minimally or omit them
            return <div key={block.id} className="text-xs italic text-muted-foreground my-2">[Unsupported block type: {type}]</div>;
        }
      })}
    </div>
  );
} 