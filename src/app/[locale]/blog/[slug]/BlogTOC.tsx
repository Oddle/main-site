'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { cn } from "@/lib/utils";

// --- Helper function to generate a slug from text (must match PostRenderer) ---
function slugify(text: string): string {
  if (!text) return 'section'; 
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[&/\#,+()$~%.'":*?<>{}]/g, '')
    .replace(/--+/g, '-');
}

// --- Helper to extract plain text from rich text array ---
function getPlainText(richTextArr: RichTextItemResponse[]): string {
    if (!richTextArr || !Array.isArray(richTextArr)) return '';
    return richTextArr.map((rt: RichTextItemResponse) => rt.plain_text).join('');
}

// --- Define structure for extracted headings ---
interface HeadingInfo {
    id: string;
    text: string;
    level: number; // 1, 2, or 3
}

// --- Component Props ---
interface BlogTOCProps {
    blocks: BlockObjectResponse[];
}

// --- Table of Contents Component ---
export function BlogTOC({ blocks }: BlogTOCProps) {
    const [activeHeadings, setActiveHeadings] = useState<string[]>([]);
    // useRef to store element references for the observer cleanup
    const observedElementsRef = useRef<Set<Element>>(new Set()); 

    // Memoize the extracted headings to avoid re-filtering on every render
    const headings = useMemo(() => {
        const extractedHeadings: HeadingInfo[] = [];
        if (!blocks) return extractedHeadings;

        blocks.forEach((block) => {
            // Use type guards instead of any cast
            if (block.type === 'heading_1') {
                const content = block.heading_1;
                const text = getPlainText(content?.rich_text);
                if (text) extractedHeadings.push({ id: slugify(text), text: text, level: 1 });
            } else if (block.type === 'heading_2') {
                 const content = block.heading_2;
                 const text = getPlainText(content?.rich_text);
                 if (text) extractedHeadings.push({ id: slugify(text), text: text, level: 2 });
            } else if (block.type === 'heading_3') {
                 const content = block.heading_3;
                 const text = getPlainText(content?.rich_text);
                 if (text) extractedHeadings.push({ id: slugify(text), text: text, level: 3 });
            }
        });
        return extractedHeadings;
    }, [blocks]);

    useEffect(() => {
        if (headings.length === 0) return;

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            setActiveHeadings(currentActive => {
                const activeSet = new Set(currentActive);
                entries.forEach(entry => {
                    const id = entry.target.id;
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        activeSet.add(id);
                    } else {
                        activeSet.delete(id);
                    }
                });
                // Prioritize lower headings if multiple are active (often happens at boundaries)
                const sortedActive = Array.from(activeSet).sort((a, b) => {
                    const headingA = headings.find(h => h.id === a);
                    const headingB = headings.find(h => h.id === b);
                    return (headingA?.level ?? 4) - (headingB?.level ?? 4);
                });
                // Return only the ID of the highest priority active heading
                return sortedActive.length > 0 ? [sortedActive[0]] : [];
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: "-10% 0px -60% 0px", 
            threshold: 0.5, 
        });
        
        // Copy ref to variable for cleanup
        const observedElements = observedElementsRef.current;

        // Clear previous observers before observing new elements
        observedElements.forEach(element => observer.unobserve(element));
        observedElements.clear();

        headings.forEach(({ id }) => {
            // Use requestAnimationFrame to ensure DOM element is available
            requestAnimationFrame(() => {
                 const element = document.getElementById(id);
                 if (element) {
                    observer.observe(element);
                    observedElements.add(element); // Keep track for cleanup
                 }
            });
        });

        return () => {
            // Use the variable in the cleanup function
            observedElements.forEach(element => observer.unobserve(element));
            observer.disconnect();
            observedElements.clear(); // Clear the set using the variable
        };
    }, [headings]); // Depend only on headings array

    if (headings.length === 0) {
        return null; // Don't render TOC if no headings found
    }

    return (
        <nav className="sticky top-24 h-fit"> 
            <p className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-foreground">
                In this article
            </p>
            <ul className="text-sm">
                {headings.map((heading) => (
                    <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}> 
                        <a
                            href={`#${heading.id}`}
                            className={cn(
                                "block border-l py-1 pl-2.5 transition-colors duration-150",
                                "text-muted-foreground hover:text-primary",
                                activeHeadings.includes(heading.id)
                                    ? "border-primary font-medium text-primary"
                                    : "border-transparent hover:border-border"
                            )}
                            onClick={(e) => {
                                e.preventDefault(); 
                                const element = document.getElementById(heading.id);
                                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
} 