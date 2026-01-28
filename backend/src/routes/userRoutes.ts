import { Router, Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Search users (must be before /:id to avoid route conflict)
router.get(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;

      if (!query || query.trim().length === 0) {
        throw new AppError(400, 'Search query is required');
      }

      const users = await userService.searchUsers(query);

      res.json({
        status: 'success',
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user by ID
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);

      const user = await userService.getUserById(userId);

      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update user profile
router.put(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, bio, profilePictureUrl } = req.body;

      const user = await userService.updateUser(req.userId!, {
        firstName,
        lastName,
        bio,
        profilePictureUrl,
      });

      res.json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
