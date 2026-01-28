import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getLikeCount, hasUserLikedPost } from './likeService';
import { getCommentCount } from './commentService';

interface CreatePostData {
  userId: number;
  content: string;
  imageUrl?: string;
}

export const createPost = async (data: CreatePostData) => {
  const { userId, content, imageUrl } = data;

  const result = await query(
    `INSERT INTO posts (user_id, content, image_url)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, content, image_url, created_at, updated_at`,
    [userId, content, imageUrl || null]
  );

  const post = result.rows[0];

  return {
    id: post.id,
    userId: post.user_id,
    content: post.content,
    imageUrl: post.image_url,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
};

const enrichPostWithCounts = async (post: any, currentUserId?: number) => {
  const likeCount = await getLikeCount(post.id);
  const commentCount = await getCommentCount(post.id);
  const isLiked = currentUserId ? await hasUserLikedPost(currentUserId, post.id) : false;

  return {
    id: post.id,
    userId: post.user_id,
    content: post.content,
    imageUrl: post.image_url,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    author: {
      username: post.username,
      firstName: post.first_name,
      lastName: post.last_name,
      profilePictureUrl: post.profile_picture_url,
    },
    likeCount,
    commentCount,
    isLiked,
  };
};

export const getTimeline = async (
  userId: number,
  page: number = 1,
  limit: number = 20
) => {
  const offset = (page - 1) * limit;

  // Critical timeline query: Get posts from user + friends
  const result = await query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id IN (
       SELECT $1
       UNION
       SELECT CASE WHEN f.user_id_1 = $1 THEN f.user_id_2 ELSE f.user_id_1 END
       FROM friendships f
       WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1) AND f.status = 'accepted'
     )
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const enrichedPosts = await Promise.all(
    result.rows.map((post) => enrichPostWithCounts(post, userId))
  );

  return enrichedPosts;
};

export const getPostsByUser = async (
  userId: number,
  currentUserId: number,
  page: number = 1,
  limit: number = 20
) => {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const enrichedPosts = await Promise.all(
    result.rows.map((post) => enrichPostWithCounts(post, currentUserId))
  );

  return enrichedPosts;
};

export const deletePost = async (postId: number, userId: number) => {
  // Verify ownership
  const checkResult = await query(
    `SELECT user_id FROM posts WHERE id = $1`,
    [postId]
  );

  if (checkResult.rows.length === 0) {
    throw new AppError(404, 'Post not found');
  }

  if (checkResult.rows[0].user_id !== userId) {
    throw new AppError(403, 'You can only delete your own posts');
  }

  // Delete post
  await query(`DELETE FROM posts WHERE id = $1`, [postId]);

  return { message: 'Post deleted successfully' };
};
