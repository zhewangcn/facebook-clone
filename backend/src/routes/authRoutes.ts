import { Router, Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { authenticate } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router = Router();

// Register
router.post(
  '/register',
  validateRegistration,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      const result = await authService.register({
        username,
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login
router.post(
  '/login',
  validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get(
  '/me',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getCurrentUser(req.userId!);

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
