import React from 'react';
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { PostRenderer } from "./PostRenderer";

interface BlogContentProps {
  blocks: BlockObjectResponse[];
}

// This is a Server Component to render the main content using PostRenderer
export function BlogContent({ blocks }: BlogContentProps) {
  // Potentially add logic here later to find the first image block 
  // and render it differently (e.g., full width above the prose content)
  
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PostRenderer blocks={blocks} />
    </div>
  );
} 