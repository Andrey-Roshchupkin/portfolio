import { processMarkdownModules, type MarkdownItem } from './markdown';

export interface Post extends MarkdownItem {}

export async function getPosts(): Promise<Post[]> {
  // Vite requires static glob patterns
  const modules = import.meta.glob('/materials/posts/*.md', { query: '?raw', import: 'default', eager: false });
  return processMarkdownModules(modules as Record<string, () => Promise<string>>);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find(post => post.slug === slug) || null;
}