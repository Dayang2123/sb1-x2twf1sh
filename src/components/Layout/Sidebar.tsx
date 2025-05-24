import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileEdit, 
  Folder,
  Send,
  Settings,
  Menu,
  ChevronLeft,
  Newspaper // Import Newspaper icon
} from 'lucide-react';
import { useAppContext } from '../../context/useAppContext';

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useAppContext();

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/editor', name: 'New Content', icon: <FileEdit className="w-5 h-5" /> },
    { path: '/drafts', name: 'Drafts', icon: <Folder className="w-5 h-5" /> },
    { path: '/published', name: 'Published', icon: <Send className="w-5 h-5" /> },
    { path: '/news-feed', name: 'News Feed', icon: <Newspaper className="w-5 h-5" /> }, // Add News Feed link
    { path: '/settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <nav 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isSidebarOpen && (
          <h1 className="text-xl font-serif font-bold text-blue-600">ContentAI</h1>
        )}
        <button 
          onClick={toggleSidebar} 
          className={`p-2 rounded-md hover:bg-gray-100 ${isSidebarOpen ? '' : 'mx-auto'}`}
        >
          {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <div className="py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center py-3 px-4 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              } ${
                isSidebarOpen ? 'justify-start mx-2 rounded-md' : 'justify-center'
              }`
            }
          >
            {item.icon}
            {isSidebarOpen && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;