import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 50;
};

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, firstName, lastName } = req.body;

  if (!username || !email || !password || !firstName || !lastName) {
    throw new AppError(400, 'All fields are required');
  }

  if (!validateUsername(username)) {
    throw new AppError(400, 'Username must be between 3 and 50 characters');
  }

  if (!validateEmail(email)) {
    throw new AppError(400, 'Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new AppError(400, 'Password must be at least 6 characters');
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  if (!validateEmail(email)) {
    throw new AppError(400, 'Invalid email format');
  }

  next();
};
