import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import FriendList from '../components/friends/FriendList';
import FriendRequests from '../components/friends/FriendRequests';
import { useSearchUsers, useSendFriendRequest } from '../hooks/useFriends';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { data: searchResults, isLoading: searchLoading } = useSearchUsers(searchQuery);
  const sendFriendRequest = useSendFriendRequest();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await sendFriendRequest.mutateAsync(userId);
      alert('Friend request sent!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Friends</h1>

        <div className="mb-6 flex space-x-2 border-b">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'friends'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            My Friends
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'requests'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Friend Requests
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'search'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Find Friends
          </button>
        </div>

        {activeTab === 'friends' && <FriendList />}

        {activeTab === 'requests' && <FriendRequests />}

        {activeTab === 'search' && (
          <div>
            <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
              <Input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or username..."
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>

            {searchLoading && <div className="text-center py-4">Searching...</div>}

            {searchResults && searchResults.length > 0 && (
              <div className="space-y-4">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSendRequest(user.id)}
                      disabled={sendFriendRequest.isPending}
                    >
                      Add Friend
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {searchResults && searchResults.length === 0 && searchQuery && (
              <div className="text-center text-gray-500 py-8">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Friends;
