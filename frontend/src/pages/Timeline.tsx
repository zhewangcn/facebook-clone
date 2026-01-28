import React from 'react';
import Layout from '../components/layout/Layout';
import CreatePostForm from '../components/posts/CreatePostForm';
import PostList from '../components/posts/PostList';
import { useTimeline } from '../hooks/usePosts';

const Timeline: React.FC = () => {
  const { data: posts, isLoading } = useTimeline();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Timeline</h1>
        <CreatePostForm />
        <PostList posts={posts || []} loading={isLoading} />
      </div>
    </Layout>
  );
};

export default Timeline;
