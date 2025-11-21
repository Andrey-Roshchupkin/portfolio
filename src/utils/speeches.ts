import { processMarkdownModules, type MarkdownItem } from './markdown';

export interface Speech extends MarkdownItem {}

export async function getSpeeches(): Promise<Speech[]> {
  // Vite requires static glob patterns
  const modules = import.meta.glob('/materials/speeches/*.md', { query: '?raw', import: 'default', eager: false });
  return processMarkdownModules(modules as Record<string, () => Promise<string>>);
}

export async function getSpeechBySlug(slug: string): Promise<Speech | null> {
  const speeches = await getSpeeches();
  return speeches.find(speech => speech.slug === slug) || null;
}

