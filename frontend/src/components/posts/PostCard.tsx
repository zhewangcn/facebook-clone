import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../api/posts';
import { useAuth } from '../../hooks/useAuth';
import { useDeletePost, useLikePost, useUnlikePost, useComments, useCreateComment, useDeleteComment } from '../../hooks/usePosts';
import Button from '../common/Button';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const deletePost = useDeletePost();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const { data: comments, isLoading: commentsLoading } = useComments(post.id);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost.mutateAsync(post.id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleLike = async () => {
    try {
      if (post.isLiked) {
        await unlikePost.mutateAsync(post.id);
      } else {
        await likePost.mutateAsync(post.id);
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await createComment.mutateAsync({ postId: post.id, content: commentContent });
      setCommentContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment.mutateAsync(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {post.author.firstName[0]}{post.author.lastName[0]}
          </div>
          <div>
            <Link
              to={`/profile/${post.userId}`}
              className="font-semibold hover:underline"
            >
              {post.author.firstName} {post.author.lastName}
            </Link>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {user?.id === post.userId && (
          <Button
            variant="secondary"
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="text-sm"
          >
            Delete
          </Button>
        )}
      </div>

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full rounded-lg mb-4"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      {/* Like and Comment Buttons */}
      <div className="flex items-center space-x-4 border-t pt-3 mb-3">
        <button
          onClick={handleLike}
          disabled={likePost.isPending || unlikePost.isPending}
          className={`flex items-center space-x-1 ${
            post.isLiked ? 'text-blue-600 font-semibold' : 'text-gray-600'
          } hover:text-blue-600 transition-colors`}
        >
          <span>{post.isLiked ? '👍' : '👍🏻'}</span>
          <span>{post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <span>💬</span>
          <span>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t pt-3">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={createComment.isPending || !commentContent.trim()}
              >
                Post
              </Button>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center text-gray-500 py-2">Loading comments...</div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {comment.author.firstName[0]}{comment.author.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/profile/${comment.userId}`}
                          className="font-semibold text-sm hover:underline"
                        >
                          {comment.author.firstName} {comment.author.lastName}
                        </Link>
                        <p className="text-gray-800 text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    {user?.id === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-2">No comments yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
