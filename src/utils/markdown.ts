import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

export interface MarkdownItem {
  slug: string;
  title: string;
  date: Date;
  content: string;
}

/**
 * Extracts date from filename if it follows pattern: YYYY-MM-DD-filename.md
 */
export function extractDateFromFilename(filename: string): Date | null {
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  if (dateMatch) {
    const date = new Date(dateMatch[1]);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null;
}

/**
 * Generates URL-friendly slug from filename
 */
export function generateSlug(path: string): string {
  const filename = path.split('/').pop() || '';
  const withoutExt = filename.replace(/\.md$/, '');
  const withoutDate = withoutExt.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return withoutDate.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Parses a markdown file and extracts metadata and content
 */
function parseMarkdownFile(rawContent: string, path: string): MarkdownItem {
  const { data, content } = matter(rawContent);
  
  // Extract title: 1. Frontmatter, 2. First H1, 3. Fallback
  let title = data.title;
  if (!title) {
    const h1Match = content.match(/^#\s+(.*)/m);
    title = h1Match ? h1Match[1] : 'Untitled';
  }

  // Extract date: 1. Frontmatter, 2. Filename, 3. Current date
  let date: Date;
  if (data.date) {
    date = new Date(data.date);
  } else {
    const filename = path.split('/').pop() || '';
    const dateFromFilename = extractDateFromFilename(filename);
    date = dateFromFilename || new Date();
  }

  // Validate date
  if (isNaN(date.getTime())) {
    date = new Date();
  }

  return {
    slug: generateSlug(path),
    title,
    date,
    content
  };
}

/**
 * Generic function to get all markdown items from modules
 * Note: Vite requires static glob patterns, so this function accepts pre-loaded modules
 */
export async function processMarkdownModules(
  modules: Record<string, () => Promise<string>>
): Promise<MarkdownItem[]> {
  const items: MarkdownItem[] = [];

  for (const path in modules) {
    const rawContent = await modules[path]();
    items.push(parseMarkdownFile(rawContent as string, path));
  }

  // Sort by date descending (newest first)
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

