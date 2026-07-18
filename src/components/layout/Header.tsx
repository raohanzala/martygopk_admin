import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMenu, IoLogOutOutline } from 'react-icons/io5';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { NotificationDropdown } from '@/features/notification';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setShowProfileMenu(false);
    navigate('/login');
  };

  return (
    <header className="h-16 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Search */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 text-text-secondary hover:bg-background hover:text-primary transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <IoMenu className="w-6 h-6" />
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-background transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-text-muted">{user?.email || 'admin@example.com'}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded shadow-lg border border-border py-2 z-20">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {user?.email || 'admin@example.com'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-background hover:text-primary transition-colors"
                  >
                    <IoLogOutOutline className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
