import { apiClient } from './client';

export interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
  };
}

export interface CreatePostData {
  content: string;
  imageUrl?: string;
}

export const postsApi = {
  createPost: async (data: CreatePostData): Promise<Post> => {
    const response = await apiClient.post('/posts', data);
    return response.data.data.post;
  },

  getTimeline: async (page: number = 1, limit: number = 20): Promise<Post[]> => {
    const response = await apiClient.get('/posts/timeline', {
      params: { page, limit },
    });
    return response.data.data.posts;
  },

  getUserPosts: async (userId: number, page: number = 1, limit: number = 20): Promise<Post[]> => {
    const response = await apiClient.get(`/posts/user/${userId}`, {
      params: { page, limit },
    });
    return response.data.data.posts;
  },

  deletePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
  },

  likePost: async (postId: number): Promise<void> => {
    await apiClient.post(`/posts/${postId}/like`);
  },

  unlikePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/posts/${postId}/like`);
  },

  getComments: async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data.data.comments;
  },

  createComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await apiClient.post(`/posts/${postId}/comments`, { content });
    return response.data.data.comment;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/posts/comments/${commentId}`);
  },
};
