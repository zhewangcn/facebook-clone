import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const createComment = async (
  userId: number,
  postId: number,
  content: string
) => {
  // Check if post exists
  const postCheck = await query(`SELECT id FROM posts WHERE id = $1`, [postId]);

  if (postCheck.rows.length === 0) {
    throw new AppError(404, 'Post not found');
  }

  // Create comment
  const result = await query(
    `INSERT INTO comments (user_id, post_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, post_id, content, created_at, updated_at`,
    [userId, postId, content]
  );

  const comment = result.rows[0];

  // Get user info
  const userResult = await query(
    `SELECT username, first_name, last_name, profile_picture_url FROM users WHERE id = $1`,
    [userId]
  );

  const user = userResult.rows[0];

  return {
    id: comment.id,
    userId: comment.user_id,
    postId: comment.post_id,
    content: comment.content,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    author: {
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePictureUrl: user.profile_picture_url,
    },
  };
};

export const getPostComments = async (postId: number) => {
  const result = await query(
    `SELECT c.*, u.username, u.first_name, u.last_name, u.profile_picture_url
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    postId: row.post_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: {
      username: row.username,
      firstName: row.first_name,
      lastName: row.last_name,
      profilePictureUrl: row.profile_picture_url,
    },
  }));
};

export const deleteComment = async (commentId: number, userId: number) => {
  // Verify ownership
  const checkResult = await query(
    `SELECT user_id FROM comments WHERE id = $1`,
    [commentId]
  );

  if (checkResult.rows.length === 0) {
    throw new AppError(404, 'Comment not found');
  }

  if (checkResult.rows[0].user_id !== userId) {
    throw new AppError(403, 'You can only delete your own comments');
  }

  // Delete comment
  await query(`DELETE FROM comments WHERE id = $1`, [commentId]);

  return { message: 'Comment deleted successfully' };
};

export const getCommentCount = async (postId: number): Promise<number> => {
  const result = await query(
    `SELECT COUNT(*) as count FROM comments WHERE post_id = $1`,
    [postId]
  );

  return parseInt(result.rows[0].count);
};
