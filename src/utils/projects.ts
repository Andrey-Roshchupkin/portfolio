import { processMarkdownModules, type MarkdownItem } from './markdown';

export interface Project extends MarkdownItem {}

export async function getProjects(): Promise<Project[]> {
  // Vite requires static glob patterns
  const modules = import.meta.glob('/materials/projects/*.md', { query: '?raw', import: 'default', eager: false });
  return processMarkdownModules(modules as Record<string, () => Promise<string>>);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find(project => project.slug === slug) || null;
}

