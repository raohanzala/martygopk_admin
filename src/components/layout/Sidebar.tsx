import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IoHomeOutline,
  IoGridOutline,
  IoFolderOutline,
  IoPricetagOutline,
  IoReceiptOutline,
  IoNewspaperOutline,
  IoStarOutline,
  IoMailOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoPeopleOutline,
  IoGiftOutline,
} from 'react-icons/io5';
import { cn } from '@/utils/cn';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: <IoHomeOutline className="w-5 h-5" />,
      path: '/',
    },
    {
      label: 'Products',
      icon: <IoGridOutline className="w-5 h-5" />,
      path: '/products',
    },
    {
      label: 'Categories',
      icon: <IoFolderOutline className="w-5 h-5" />,
      path: '/categories',
    },
    // {
    //   label: 'Brands',
    //   icon: <IoPricetagOutline className="w-5 h-5" />,
    //   path: '/brands',
    // },
    {
      label: 'Orders',
      icon: <IoReceiptOutline className="w-5 h-5" />,
      path: '/orders',
    },
    // {
    //   label: 'Promo codes',
    //   icon: <IoGiftOutline className="w-5 h-5" />,
    //   path: '/promos',
    // },
    // {
    //   label: 'Blog',
    //   icon: <IoNewspaperOutline className="w-5 h-5" />,
    //   path: '/blogs',
    // },
    // {
    //   label: 'Reviews',
    //   icon: <IoStarOutline className="w-5 h-5" />,
    //   path: '/reviews',
    // },
    // {
    //   label: 'Newsletter',
    //   icon: <IoMailOutline className="w-5 h-5" />,
    //   path: '/newsletter',
    // },
    {
      label: 'Notifications',
      icon: <IoNotificationsOutline className="w-5 h-5" />,
      path: '/notifications',
    },
    // {
    //   label: 'Users',
    //   icon: <IoPeopleOutline className="w-5 h-5" />,
    //   path: '/users',
    // },
    {
      label: 'Settings',
      icon: <IoSettingsOutline className="w-5 h-5" />,
      path: '/settings',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-secondary/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#001846] border-r border-border/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center px-6 py-5 border-b border-white/10">

            <img src="/src/assets/logo.png" alt="Realtime Wrist Logo" width={100} height={32} className="w-48 h-auto" />
            {/* <button
              onClick={onClose}
              className="lg:hidden p-1  rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <IoClose className="w-6 h-6" />
            </button> */}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group',
                        active
                          ? 'bg-primary text-white font-medium'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <span
                        className={cn(
                          'transition-colors',
                          active ? 'text-white' : 'text-white/70 group-hover:text-white'
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-error text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4  text-gray-500 text-xs text-center border-white/10">
          Copyright 2026 @ <a href="https://realtimewrist.com" target="_blank" rel="noopener noreferrer" >realtimewrist.pk</a> - All Rights Reserved.
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
