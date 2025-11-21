import { getPostBySlug, type Post } from '../utils/posts';
import { ContentView } from './ContentView';

export function PostView() {
  return (
    <ContentView<Post>
      getItemBySlug={getPostBySlug}
      backPath="/"
      notFoundMessage="Post not found"
      notFoundLinkLabel="Go back to articles"
    />
  );
}

