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

export async function getContent(folder: 'about' | 'resume'): Promise<string> {
  // Vite requires static glob patterns, so we need to use conditional logic
  let modules: Record<string, () => Promise<string>>;
  
  if (folder === 'about') {
    modules = import.meta.glob('/materials/about/*.md', { query: '?raw', import: 'default', eager: false }) as Record<string, () => Promise<string>>;
  } else {
    modules = import.meta.glob('/materials/resume/SDET-AQA-Andrey-Roshchupkin.md', { query: '?raw', import: 'default', eager: false }) as Record<string, () => Promise<string>>;
  }
  
  // Get the first (and should be only) file
  for (const path in modules) {
    const rawContent = await modules[path]();
    const { content } = matter(rawContent as string);
    return content;
  }
  
  return '';
}

