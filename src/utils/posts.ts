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

export interface Post {
  slug: string;
  title: string;
  date: Date;
  content: string;
}

/**
 * Extracts date from filename if it follows pattern: YYYY-MM-DD-filename.md
 */
function extractDateFromFilename(filename: string): Date | null {
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
function generateSlug(path: string): string {
  const filename = path.split('/').pop() || '';
  // Remove .md extension and date prefix if present
  const withoutExt = filename.replace(/\.md$/, '');
  const withoutDate = withoutExt.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  // Convert to URL-friendly format
  return withoutDate.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function getPosts(): Promise<Post[]> {
  // Vite glob import to get all MD files
  const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default', eager: false });

  const posts: Post[] = [];

  for (const path in modules) {
    const rawContent = await modules[path]();
    const { data, content } = matter(rawContent);
    
    // 1. Try to get title from Frontmatter
    // 2. Else, try to parse the first # H1 from text
    let title = data.title;
    if (!title) {
        const h1Match = content.match(/^#\s+(.*)/m);
        title = h1Match ? h1Match[1] : 'Untitled';
    }

    // Parse date with priority:
    // 1. Frontmatter date
    // 2. Date from filename (YYYY-MM-DD-filename.md)
    // 3. Fallback to current date (not ideal, but required for browser environment)
    // Note: Actual file creation dates are not available in browser.
    // Consider adding dates to frontmatter or using a build script for file dates.
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

    posts.push({
      slug: generateSlug(path),
      title,
      date,
      content
    });
  }

  // Sort by date descending (newest first)
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find(post => post.slug === slug) || null;
}