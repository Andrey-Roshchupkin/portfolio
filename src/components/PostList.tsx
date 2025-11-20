import { Link } from 'react-router-dom';
import { getPosts, type Post } from '../utils/posts';
import { useEffect, useState } from 'react';

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-[#24292f] dark:text-[#e6edf3] mb-2">
          Just call me Andrew
        </h2>
        <p className="text-sm text-[#57606a] dark:text-[#7d8590]">
          My articles
        </p>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/post/${post.slug}`}
            className="group block rounded-lg border border-[#d1d9de] bg-white p-5 transition-all hover:border-[#0969da] hover:shadow-sm hover:bg-[#f6f8fa] dark:border-[#30363d] dark:bg-[#161b22] dark:hover:border-[#58a6ff] dark:hover:bg-[#21262d]"
          >
            <div className="mb-2 text-xs font-medium text-[#57606a] dark:text-[#7d8590] uppercase tracking-wide">
              {post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h3 className="text-lg font-semibold text-[#24292f] dark:text-[#e6edf3] group-hover:text-[#0969da] dark:group-hover:text-[#58a6ff] transition-colors">
              {post.title}
            </h3>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-[#57606a] dark:text-[#7d8590] text-center py-12">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
}

