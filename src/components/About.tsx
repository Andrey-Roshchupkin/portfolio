import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getContent } from '../utils/content';

export function About() {
  const [content, setContent] = useState('');

  useEffect(() => {
    getContent('about').then(setContent);
  }, []);

  return (
    <section className="space-y-6">
      <article className="markdown-body prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{content || 'Loading...'}</ReactMarkdown>
      </article>
    </section>
  );
}

