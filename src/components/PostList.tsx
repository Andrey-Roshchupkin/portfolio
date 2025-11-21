import { useEffect, useState } from 'react';
import { getPosts, type Post } from '../utils/posts';
import { ItemList, type ListItem } from './ItemList';

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return <ItemList items={posts as ListItem[]} basePath="/post" emptyMessage="No posts found." />;
}

