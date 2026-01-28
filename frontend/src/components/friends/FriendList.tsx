import React from 'react';
import { Link } from 'react-router-dom';
import { useFriends } from '../../hooks/useFriends';
import LoadingSpinner from '../common/LoadingSpinner';

const FriendList: React.FC = () => {
  const { data: friends, isLoading } = useFriends();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No friends yet. Start by sending friend requests!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friends.map((friend) => (
        <Link
          key={friend.friendshipId}
          to={`/profile/${friend.id}`}
          className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {friend.firstName[0]}{friend.lastName[0]}
          </div>
          <div>
            <p className="font-semibold">
              {friend.firstName} {friend.lastName}
            </p>
            <p className="text-sm text-gray-500">@{friend.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FriendList;
