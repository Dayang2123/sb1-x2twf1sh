import React from 'react';
import { Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/editor':
        return 'Content Editor';
      case '/drafts':
        return 'My Drafts';
      case '/published':
        return 'Published Content';
      case '/settings':
        return 'Settings';
      default:
        if (location.pathname.startsWith('/editor/')) {
          return 'Edit Content';
        }
        return 'Content Creator';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-serif font-semibold text-gray-800">{getPageTitle()}</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header;