import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { PenSquare, Search, Clock, Calendar, Trash2, MoreHorizontal } from 'lucide-react';
import ContentCard from '../components/Content/ContentCard';

const Drafts: React.FC = () => {
  const { contents, deleteContent } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  
  const drafts = contents.filter(content => content.status === 'draft');
  
  const filteredDrafts = searchQuery
    ? drafts.filter(draft => 
        draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        draft.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : drafts;
    
  const sortedDrafts = [...filteredDrafts].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'oldest':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case 'az':
        return a.title.localeCompare(b.title);
      case 'za':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handleDeleteDraft = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this draft?')) {
      deleteContent(id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-800">My Drafts</h2>
        <Link 
          to="/editor" 
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 transition-colors text-white rounded-md text-sm font-medium"
        >
          <PenSquare className="w-4 h-4 mr-2" />
          New Content
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drafts..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2" />
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="sortOrder" className="text-sm text-gray-600">Sort by:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="py-2 px-3 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A to Z</option>
              <option value="za">Z to A</option>
            </select>
          </div>
        </div>
        
        {sortedDrafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDrafts.map(draft => (
              <Link 
                key={draft.id}
                to={`/editor/${draft.id}`}
                className="block border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow group relative animate-fade-in"
              >
                <div className="mb-2 flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {draft.title}
                  </h3>
                  <div className="relative ml-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Toggle dropdown menu would go here
                      }}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {draft.content.replace(/#|##|\*\*|__/g, '').substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Last updated: {new Date(draft.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteDraft(draft.id, e)}
                    className="p-1 rounded-full hover:bg-error-100 text-gray-500 hover:text-error-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PenSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No drafts found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No drafts matching "${searchQuery}"`
                : "You don't have any draft content yet"}
            </p>
            <Link 
              to="/editor" 
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 transition-colors text-white rounded-md font-medium"
            >
              Create New Content
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drafts;