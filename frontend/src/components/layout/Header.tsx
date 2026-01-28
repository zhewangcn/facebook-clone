import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/timeline" className="text-2xl font-bold hover:text-blue-100">
            Facebook Clone
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/timeline"
              className="hover:text-blue-100 transition-colors"
            >
              Timeline
            </Link>
            <Link
              to={`/profile/${user?.id}`}
              className="hover:text-blue-100 transition-colors"
            >
              Profile
            </Link>
            <Link
              to="/friends"
              className="hover:text-blue-100 transition-colors"
            >
              Friends
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user?.firstName} {user?.lastName}
            </span>
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
