import { apiClient } from './client';

export interface Friend {
  friendshipId: number;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
}

export interface FriendRequest {
  friendshipId: number;
  requesterId: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  createdAt: string;
}

export const friendsApi = {
  sendFriendRequest: async (userId: number): Promise<void> => {
    await apiClient.post(`/friends/request/${userId}`);
  },

  acceptFriendRequest: async (friendshipId: number): Promise<void> => {
    await apiClient.put(`/friends/accept/${friendshipId}`);
  },

  rejectFriendRequest: async (friendshipId: number): Promise<void> => {
    await apiClient.put(`/friends/reject/${friendshipId}`);
  },

  getFriends: async (): Promise<Friend[]> => {
    const response = await apiClient.get('/friends');
    return response.data.data.friends;
  },

  getFriendRequests: async (): Promise<FriendRequest[]> => {
    const response = await apiClient.get('/friends/requests');
    return response.data.data.requests;
  },
};
