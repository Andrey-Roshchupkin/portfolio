import { useEffect, useState } from 'react';
import { getPosts, type Post } from '../utils/posts';
import { ItemList, type ListItem } from './ItemList';

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return <ItemList items={posts as ListItem[]} basePath="/post" emptyMessage="No posts found." loading={loading} ariaLabel="Articles list" />;
}

