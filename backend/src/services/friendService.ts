import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Helper function to normalize friendship (ensure userId1 < userId2)
const normalizeFriendship = (userId1: number, userId2: number) => {
  return userId1 < userId2
    ? { user_id_1: userId1, user_id_2: userId2 }
    : { user_id_1: userId2, user_id_2: userId1 };
};

export const sendFriendRequest = async (
  requesterId: number,
  targetUserId: number
) => {
  if (requesterId === targetUserId) {
    throw new AppError(400, 'Cannot send friend request to yourself');
  }

  // Verify target user exists
  const userCheck = await query(`SELECT id FROM users WHERE id = $1`, [
    targetUserId,
  ]);

  if (userCheck.rows.length === 0) {
    throw new AppError(404, 'User not found');
  }

  const { user_id_1, user_id_2 } = normalizeFriendship(
    requesterId,
    targetUserId
  );

  // Check if friendship already exists
  const existingFriendship = await query(
    `SELECT id, status FROM friendships WHERE user_id_1 = $1 AND user_id_2 = $2`,
    [user_id_1, user_id_2]
  );

  if (existingFriendship.rows.length > 0) {
    const status = existingFriendship.rows[0].status;
    if (status === 'accepted') {
      throw new AppError(400, 'You are already friends');
    } else if (status === 'pending') {
      throw new AppError(400, 'Friend request already sent');
    }
  }

  // Create friendship
  const result = await query(
    `INSERT INTO friendships (user_id_1, user_id_2, status, requester_id)
     VALUES ($1, $2, 'pending', $3)
     RETURNING id, user_id_1, user_id_2, status, requester_id, created_at`,
    [user_id_1, user_id_2, requesterId]
  );

  const friendship = result.rows[0];

  return {
    id: friendship.id,
    userId1: friendship.user_id_1,
    userId2: friendship.user_id_2,
    status: friendship.status,
    requesterId: friendship.requester_id,
    createdAt: friendship.created_at,
  };
};

export const acceptFriendRequest = async (
  friendshipId: number,
  userId: number
) => {
  // Get friendship
  const result = await query(
    `SELECT * FROM friendships WHERE id = $1`,
    [friendshipId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Friend request not found');
  }

  const friendship = result.rows[0];

  // Verify user is the recipient (not the requester)
  if (friendship.requester_id === userId) {
    throw new AppError(403, 'Cannot accept your own friend request');
  }

  // Verify user is part of the friendship
  if (friendship.user_id_1 !== userId && friendship.user_id_2 !== userId) {
    throw new AppError(403, 'Not authorized to accept this friend request');
  }

  // Verify status is pending
  if (friendship.status !== 'pending') {
    throw new AppError(400, 'Friend request is not pending');
  }

  // Update status to accepted
  await query(
    `UPDATE friendships SET status = 'accepted' WHERE id = $1`,
    [friendshipId]
  );

  return { message: 'Friend request accepted' };
};

export const rejectFriendRequest = async (
  friendshipId: number,
  userId: number
) => {
  // Get friendship
  const result = await query(
    `SELECT * FROM friendships WHERE id = $1`,
    [friendshipId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'Friend request not found');
  }

  const friendship = result.rows[0];

  // Verify user is the recipient (not the requester)
  if (friendship.requester_id === userId) {
    throw new AppError(403, 'Cannot reject your own friend request');
  }

  // Verify user is part of the friendship
  if (friendship.user_id_1 !== userId && friendship.user_id_2 !== userId) {
    throw new AppError(403, 'Not authorized to reject this friend request');
  }

  // Delete the friendship
  await query(`DELETE FROM friendships WHERE id = $1`, [friendshipId]);

  return { message: 'Friend request rejected' };
};

export const getFriends = async (userId: number) => {
  const result = await query(
    `SELECT
       f.id as friendship_id,
       CASE
         WHEN f.user_id_1 = $1 THEN u2.id
         ELSE u1.id
       END as friend_id,
       CASE
         WHEN f.user_id_1 = $1 THEN u2.username
         ELSE u1.username
       END as username,
       CASE
         WHEN f.user_id_1 = $1 THEN u2.first_name
         ELSE u1.first_name
       END as first_name,
       CASE
         WHEN f.user_id_1 = $1 THEN u2.last_name
         ELSE u1.last_name
       END as last_name,
       CASE
         WHEN f.user_id_1 = $1 THEN u2.profile_picture_url
         ELSE u1.profile_picture_url
       END as profile_picture_url
     FROM friendships f
     JOIN users u1 ON f.user_id_1 = u1.id
     JOIN users u2 ON f.user_id_2 = u2.id
     WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1) AND f.status = 'accepted'`,
    [userId]
  );

  return result.rows.map((row) => ({
    friendshipId: row.friendship_id,
    id: row.friend_id,
    username: row.username,
    firstName: row.first_name,
    lastName: row.last_name,
    profilePictureUrl: row.profile_picture_url,
  }));
};

export const getFriendRequests = async (userId: number) => {
  const result = await query(
    `SELECT
       f.id as friendship_id,
       u.id as requester_id,
       u.username,
       u.first_name,
       u.last_name,
       u.profile_picture_url,
       f.created_at
     FROM friendships f
     JOIN users u ON f.requester_id = u.id
     WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1)
       AND f.status = 'pending'
       AND f.requester_id != $1`,
    [userId]
  );

  return result.rows.map((row) => ({
    friendshipId: row.friendship_id,
    requesterId: row.requester_id,
    username: row.username,
    firstName: row.first_name,
    lastName: row.last_name,
    profilePictureUrl: row.profile_picture_url,
    createdAt: row.created_at,
  }));
};
