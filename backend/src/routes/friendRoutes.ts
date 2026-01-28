import { Router, Request, Response, NextFunction } from 'express';
import * as friendService from '../services/friendService';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Send friend request
router.post(
  '/request/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUserId = parseInt(req.params.userId);

      const friendship = await friendService.sendFriendRequest(
        req.userId!,
        targetUserId
      );

      res.status(201).json({
        status: 'success',
        data: { friendship },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Accept friend request
router.put(
  '/accept/:friendshipId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const friendshipId = parseInt(req.params.friendshipId);

      const result = await friendService.acceptFriendRequest(
        friendshipId,
        req.userId!
      );

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Reject friend request
router.put(
  '/reject/:friendshipId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const friendshipId = parseInt(req.params.friendshipId);

      const result = await friendService.rejectFriendRequest(
        friendshipId,
        req.userId!
      );

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get friends list
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const friends = await friendService.getFriends(req.userId!);

      res.json({
        status: 'success',
        data: { friends },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get friend requests
router.get(
  '/requests',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await friendService.getFriendRequests(req.userId!);

      res.json({
        status: 'success',
        data: { requests },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
