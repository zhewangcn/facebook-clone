import { apiClient } from './client';
import { User } from './auth';

export interface SearchUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
}

export const usersApi = {
  getUserById: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.data.user;
  },

  searchUsers: async (query: string): Promise<SearchUser[]> => {
    const response = await apiClient.get('/users/search', {
      params: { q: query },
    });
    return response.data.data.users;
  },

  updateUser: async (updates: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    profilePictureUrl?: string;
  }): Promise<User> => {
    const response = await apiClient.put('/users', updates);
    return response.data.data.user;
  },
};
