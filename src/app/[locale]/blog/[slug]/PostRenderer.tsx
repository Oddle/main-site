'use client';

import * as React from 'react';
// Import specific types for blocks and rich text
import type { 
    BlockObjectResponse, 
    RichTextItemResponse, 
    ParagraphBlockObjectResponse,
    Heading1BlockObjectResponse,
    Heading2BlockObjectResponse,
    Heading3BlockObjectResponse,
    ImageBlockObjectResponse,
    CodeBlockObjectResponse,
    BulletedListItemBlockObjectResponse,
    NumberedListItemBlockObjectResponse 
} from "@notionhq/client/build/src/api-endpoints";
// Remove unused next/image import
// import Image from 'next/image'; 

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
// Use imported RichTextItemResponse type
function renderRichText(richTextArr: RichTextItemResponse[]) {
  if (!richTextArr) return null; // Add null check
  return richTextArr.map((richText, index) => {
    // Add type assertion for safety, although structure is usually consistent
    const rt = richText as Partial<RichTextItemResponse>; 
    const annotations = rt.annotations ?? { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' };
    const plain_text = rt.plain_text ?? '';
    const href = rt.href ?? null;

    let element = <React.Fragment key={index}>{plain_text}</React.Fragment>;

    if (annotations.bold) element = <strong>{element}</strong>;
    if (annotations.italic) element = <em>{element}</em>;
    if (annotations.strikethrough) element = <s>{element}</s>;
    if (annotations.underline) element = <u>{element}</u>;
    if (annotations.code) element = <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">{element}</code>; 

    if (href) element = <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 underline decoration-blue-700/50 dark:decoration-blue-400/50 hover:decoration-blue-900/50 dark:hover:decoration-blue-300/50 transition-colors duration-150">{element}</a>;

    return element;
  });
}

// --- Main Renderer Component ---
interface PostRendererProps {
  blocks: BlockObjectResponse[];
}

export function PostRenderer({ blocks }: PostRendererProps) {
  if (!blocks) return null;

  return (
    <div>
      {blocks.map((block) => {
        if (!('type' in block)) {
          return null; 
        }
        
        const type = block.type;
        // Use specific block types for better type safety accessing content
        // const content = (block as any)[type]; 

        switch (type) {
          case 'paragraph': {
            const content = (block as ParagraphBlockObjectResponse).paragraph;
            if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
            return <p key={block.id} className="mb-6 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</p>;
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
            return (
              <figure key={block.id} className="my-4">
                <img src={src} alt={caption ? "Image caption" : "Blog post image"} className="max-w-full h-auto rounded-md shadow-md" />
                {caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{caption}</figcaption>}
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
            return <li key={block.id} className="ml-4 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</li>;
          }
          case 'numbered_list_item': {
            const content = (block as NumberedListItemBlockObjectResponse).numbered_list_item;
            if (!content?.rich_text || !Array.isArray(content.rich_text)) return null;
             return <li key={block.id} className="ml-4 text-gray-600 dark:text-gray-400">{renderRichText(content.rich_text)}</li>;
          }
          default:
            console.log(`Unsupported block type: ${type}`, block);
            // Render unsupported blocks minimally or omit them
            return <div key={block.id} className="text-xs italic text-muted-foreground my-2">[Unsupported block type: {type}]</div>;
        }
      })}
    </div>
  );
} 