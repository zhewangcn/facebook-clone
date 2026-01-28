import React from 'react';
import { useFriendRequests, useAcceptFriendRequest, useRejectFriendRequest } from '../../hooks/useFriends';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const FriendRequests: React.FC = () => {
  const { data: requests, isLoading } = useFriendRequests();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();

  const handleAccept = async (friendshipId: number) => {
    try {
      await acceptRequest.mutateAsync(friendshipId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (friendshipId: number) => {
    try {
      await rejectRequest.mutateAsync(friendshipId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No pending friend requests
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.friendshipId}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {request.firstName[0]}{request.lastName[0]}
            </div>
            <div>
              <p className="font-semibold">
                {request.firstName} {request.lastName}
              </p>
              <p className="text-sm text-gray-500">@{request.username}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => handleAccept(request.friendshipId)}
              disabled={acceptRequest.isPending}
            >
              Accept
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleReject(request.friendshipId)}
              disabled={rejectRequest.isPending}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
