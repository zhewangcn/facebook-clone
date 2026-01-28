import { Router, Request, Response, NextFunction } from 'express';
import * as postService from '../services/postService';
import * as likeService from '../services/likeService';
import * as commentService from '../services/commentService';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create post
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, imageUrl } = req.body;

      if (!content || content.trim().length === 0) {
        throw new AppError(400, 'Content is required');
      }

      const post = await postService.createPost({
        userId: req.userId!,
        content,
        imageUrl,
      });

      res.status(201).json({
        status: 'success',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get timeline (user's posts + friends' posts)
router.get(
  '/timeline',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const posts = await postService.getTimeline(req.userId!, page, limit);

      res.json({
        status: 'success',
        data: { posts, page, limit },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get posts by specific user
router.get(
  '/user/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.userId);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const posts = await postService.getPostsByUser(userId, req.userId!, page, limit);

      res.json({
        status: 'success',
        data: { posts, page, limit },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete post
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.id);

      const result = await postService.deletePost(postId, req.userId!);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Like a post
router.post(
  '/:id/like',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.id);

      const like = await likeService.likePost(req.userId!, postId);

      res.status(201).json({
        status: 'success',
        data: { like },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Unlike a post
router.delete(
  '/:id/like',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.id);

      const result = await likeService.unlikePost(req.userId!, postId);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get post likes
router.get(
  '/:id/likes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.id);

      const likes = await likeService.getPostLikes(postId);

      res.json({
        status: 'success',
        data: { likes },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create a comment
router.post(
  '/:id/comments',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.id);
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        throw new AppError(400, 'Comment content is required');
      }

      const comment = await commentService.createComment(req.userId!, postId, content);

      res.status(201).json({
        status: 'success',
        data: { comment },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get post comments
router.get(
  '/:id/comments',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.id);

      const comments = await commentService.getPostComments(postId);

      res.json({
        status: 'success',
        data: { comments },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a comment
router.delete(
  '/comments/:commentId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = parseInt(req.params.commentId);

      const result = await commentService.deleteComment(commentId, req.userId!);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
