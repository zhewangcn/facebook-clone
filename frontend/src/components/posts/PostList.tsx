import React from 'react';
import { Post } from '../../api/posts';
import PostCard from './PostCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No posts yet. Start by creating a post or adding friends!
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
