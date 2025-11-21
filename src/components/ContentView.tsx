import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

interface ContentViewProps<T> {
  getItemBySlug: (slug: string) => Promise<T | null>;
  backPath: string;
  notFoundMessage: string;
  notFoundLinkLabel: string;
}

export function ContentView<T extends { content: string }>({
  getItemBySlug,
  backPath,
  notFoundMessage,
  notFoundLinkLabel,
}: ContentViewProps<T>) {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getItemBySlug(slug).then((foundItem) => {
        setItem(foundItem);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <section className="text-center py-12 text-[#57606a] dark:text-[#7d8590]">
        <p>Loading...</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="space-y-6">
        <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2 pb-4 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-sm border-b border-[#d1d9de]/50 dark:border-[#30363d]/50">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 rounded-md bg-[#f6f8fa] px-3 py-1.5 text-sm font-medium text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] transition-colors border border-[#d1d9de] dark:border-[#30363d]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-[#57606a] dark:text-[#7d8590] mb-4">{notFoundMessage}</p>
          <Link
            to={backPath}
            className="text-[#0969da] hover:underline dark:text-[#58a6ff]"
          >
            {notFoundLinkLabel}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2 pb-4 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-sm border-b border-[#d1d9de]/50 dark:border-[#30363d]/50">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 rounded-md bg-[#f6f8fa] px-3 py-1.5 text-sm font-medium text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] transition-colors border border-[#d1d9de] dark:border-[#30363d]"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <article className="markdown-body prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{item.content}</ReactMarkdown>
      </article>
    </section>
  );
}

