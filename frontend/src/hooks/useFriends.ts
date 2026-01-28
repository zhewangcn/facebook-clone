import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendsApi } from '../api/friends';
import { usersApi } from '../api/users';

export const useFriends = () => {
  return useQuery({
    queryKey: ['friends'],
    queryFn: () => friendsApi.getFriends(),
  });
};

export const useFriendRequests = () => {
  return useQuery({
    queryKey: ['friendRequests'],
    queryFn: () => friendsApi.getFriendRequests(),
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => friendsApi.sendFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: number) => friendsApi.acceptFriendRequest(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: number) => friendsApi.rejectFriendRequest(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['searchUsers', query],
    queryFn: () => usersApi.searchUsers(query),
    enabled: query.length > 0,
  });
};
