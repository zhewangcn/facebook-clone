import { query } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  profile_picture_url: string | null;
  created_at: Date;
}

export const register = async (data: RegisterData) => {
  const { username, email, password, firstName, lastName } = data;

  // Hash password
  const passwordHash = await hashPassword(password);

  // Insert user
  const result = await query(
    `INSERT INTO users (username, email, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, email, first_name, last_name, bio, profile_picture_url, created_at`,
    [username, email, passwordHash, firstName, lastName]
  );

  const user: User = result.rows[0];

  // Generate token
  const token = signToken({
    userId: user.id,
    username: user.username,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      bio: user.bio,
      profilePictureUrl: user.profile_picture_url,
      createdAt: user.created_at,
    },
    token,
  };
};

export const login = async (email: string, password: string) => {
  // Find user by email
  const result = await query(
    `SELECT id, username, email, password_hash, first_name, last_name, bio, profile_picture_url, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new AppError(401, 'Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  // Generate token
  const token = signToken({
    userId: user.id,
    username: user.username,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      bio: user.bio,
      profilePictureUrl: user.profile_picture_url,
      createdAt: user.created_at,
    },
    token,
  };
};

export const getCurrentUser = async (userId: number) => {
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
