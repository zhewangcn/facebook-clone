import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getUserById = async (userId: number) => {
  const result = await query(
    `SELECT id, username, email, first_name, last_name, bio, profile_picture_url, created_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(404, 'User not found');
  }

  const user = result.rows[0];

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    bio: user.bio,
    profilePictureUrl: user.profile_picture_url,
    createdAt: user.created_at,
  };
};

export const searchUsers = async (searchQuery: string) => {
  const result = await query(
    `SELECT id, username, first_name, last_name, profile_picture_url
     FROM users
     WHERE username ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1
     LIMIT 20`,
    [`%${searchQuery}%`]
  );

  return result.rows.map((user) => ({
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    profilePictureUrl: user.profile_picture_url,
  }));
};

export const updateUser = async (
  userId: number,
  updates: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePictureUrl?: string;
  }
) => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (updates.firstName !== undefined) {
    fields.push(`first_name = $${paramCount}`);
    values.push(updates.firstName);
    paramCount++;
  }

  if (updates.lastName !== undefined) {
    fields.push(`last_name = $${paramCount}`);
    values.push(updates.lastName);
    paramCount++;
  }

  if (updates.bio !== undefined) {
    fields.push(`bio = $${paramCount}`);
    values.push(updates.bio);
    paramCount++;
  }

  if (updates.profilePictureUrl !== undefined) {
    fields.push(`profile_picture_url = $${paramCount}`);
    values.push(updates.profilePictureUrl);
    paramCount++;
  }

  if (fields.length === 0) {
    throw new AppError(400, 'No fields to update');
  }

  values.push(userId);

  const result = await query(
    `UPDATE users
     SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, username, email, first_name, last_name, bio, profile_picture_url, created_at`,
    values
  );

  const user = result.rows[0];

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    bio: user.bio,
    profilePictureUrl: user.profile_picture_url,
    createdAt: user.created_at,
  };
};
