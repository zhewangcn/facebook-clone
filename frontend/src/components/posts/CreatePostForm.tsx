import React, { useState } from 'react';
import { useCreatePost } from '../../hooks/usePosts';
import Button from '../common/Button';

const CreatePostForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      await createPost.mutateAsync({
        content,
        imageUrl: imageUrl.trim() || undefined,
      });

      setContent('');
      setImageUrl('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          required
        />

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button
          type="submit"
          disabled={createPost.isPending || !content.trim()}
          className="w-full"
        >
          {createPost.isPending ? 'Posting...' : 'Post'}
        </Button>
      </form>
    </div>
  );
};

export default CreatePostForm;
