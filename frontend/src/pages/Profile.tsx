import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import PostList from '../components/posts/PostList';
import { useUserPosts } from '../hooks/usePosts';
import { useSendFriendRequest, useFriends } from '../hooks/useFriends';
import { usersApi } from '../api/users';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const sendFriendRequest = useSendFriendRequest();
  const { data: friends } = useFriends();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUserById(Number(userId)),
  });

  const { data: posts, isLoading: postsLoading } = useUserPosts(Number(userId));

  const isOwnProfile = currentUser?.id === Number(userId);
  const isFriend = friends?.some((friend) => friend.id === Number(userId));

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest.mutateAsync(Number(userId));
      alert('Friend request sent!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  if (userLoading) {
    return (
      <Layout>
        <div className="py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-8">User not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">@{user.username}</p>
                {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!isOwnProfile && !isFriend && (
              <Button
                onClick={handleSendRequest}
                disabled={sendFriendRequest.isPending}
              >
                Add Friend
              </Button>
            )}

            {isFriend && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                Friends
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <PostList posts={posts || []} loading={postsLoading} />
      </div>
    </Layout>
  );
};

export default Profile;
