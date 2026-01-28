import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const likePost = async (userId: number, postId: number) => {
  // Check if post exists
  const postCheck = await query(`SELECT id FROM posts WHERE id = $1`, [postId]);

  if (postCheck.rows.length === 0) {
    throw new AppError(404, 'Post not found');
  }

  // Check if user already liked this post
  const existingLike = await query(
    `SELECT id FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );

  if (existingLike.rows.length > 0) {
    throw new AppError(400, 'You already liked this post');
  }

  // Create like
  const result = await query(
    `INSERT INTO likes (user_id, post_id)
     VALUES ($1, $2)
     RETURNING id, user_id, post_id, created_at`,
    [userId, postId]
  );

  return {
    id: result.rows[0].id,
    userId: result.rows[0].user_id,
    postId: result.rows[0].post_id,
    createdAt: result.rows[0].created_at,
  };
};

export const unlikePost = async (userId: number, postId: number) => {
  // Delete like
  const result = await query(
    `DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING id`,
    [userId, postId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Like not found');
  }

  return { message: 'Post unliked successfully' };
};

export const getPostLikes = async (postId: number) => {
  const result = await query(
    `SELECT l.id, l.user_id, u.username, u.first_name, u.last_name, l.created_at
     FROM likes l
     JOIN users u ON l.user_id = u.id
     WHERE l.post_id = $1
     ORDER BY l.created_at DESC`,
    [postId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    username: row.username,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: row.created_at,
  }));
};

export const getLikeCount = async (postId: number): Promise<number> => {
  const result = await query(
    `SELECT COUNT(*) as count FROM likes WHERE post_id = $1`,
    [postId]
  );

  return parseInt(result.rows[0].count);
};

export const hasUserLikedPost = async (userId: number, postId: number): Promise<boolean> => {
  const result = await query(
    `SELECT id FROM likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );

  return result.rows.length > 0;
};
