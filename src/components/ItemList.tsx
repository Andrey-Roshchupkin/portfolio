import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export interface ListItem {
  slug: string;
  title: string;
  date: Date;
}

interface ItemListProps {
  items: ListItem[];
  basePath: string;
  emptyMessage: string;
  loading?: boolean;
}

export function ItemList({ items, basePath, emptyMessage, loading = false }: ItemListProps) {
  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#57606a] dark:text-[#7d8590]" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.slug}>
            <Link
              to={`${basePath}/${item.slug}`}
              className="group block rounded-lg border border-[#d1d9de] bg-white p-5 transition-all hover:border-[#0969da] hover:shadow-sm hover:bg-[#f6f8fa] dark:border-[#30363d] dark:bg-[#161b22] dark:hover:border-[#58a6ff] dark:hover:bg-[#21262d]"
            >
              <div className="mb-2 text-xs font-medium text-[#57606a] dark:text-[#7d8590] uppercase tracking-wide">
                {item.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h3 className="text-lg font-semibold text-[#24292f] dark:text-[#e6edf3] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
                {item.title}
              </h3>
            </Link>
          </article>
        ))}
        {items.length === 0 && (
          <p className="text-[#57606a] dark:text-[#7d8590] text-center py-12">
            {emptyMessage}
          </p>
        )}
      </div>
    </section>
  );
}

