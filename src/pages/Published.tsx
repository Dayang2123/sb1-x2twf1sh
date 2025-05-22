import React, { useState } from 'react';
import { useAppContext } from '../context/useAppContext';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, BarChart2, Copy, Calendar } from 'lucide-react';

const Published: React.FC = () => {
  const { publishedContents } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  
  // Extract all unique platforms from published content
  const platforms = [...new Set(publishedContents.flatMap(content => content.publishedPlatforms || []))];
  
  // Apply filters
  const filteredContents = publishedContents.filter(content => {
    const matchesSearch = searchQuery 
      ? content.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        content.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesPlatform = filterPlatform === 'all' 
      ? true 
      : content.publishedPlatforms?.includes(filterPlatform);
    
    return matchesSearch && matchesPlatform;
  });
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Published Content</h2>
        <p className="text-gray-600 mt-1">Manage and monitor your published content across all platforms</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search published content..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredContents.length > 0 ? (
          <div className="space-y-6">
            {filteredContents.map(content => (
              <div key={content.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-800">{content.title}</h3>
                    <div className="flex items-center mt-2 sm:mt-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 mr-2">
                        Published
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(content.publishedAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {content.content.replace(/#|##|\*\*|__/g, '').substring(0, 150)}...
                  </p>
                  
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Published to:</h4>
                    <div className="flex flex-wrap gap-2">
                      {content.publishedPlatforms?.map(platform => (
                        <span 
                          key={platform}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                            platform === 'Medium' 
                              ? 'bg-black text-white' 
                              : platform === 'WordPress' 
                              ? 'bg-blue-100 text-blue-800'
                              : platform === 'LinkedIn'
                              ? 'bg-blue-700 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-700">
                      <Link 
                        to={`/editor/${content.id}`}
                        className="inline-flex items-center hover:text-primary-600 transition-colors"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Clone
                      </Link>
                      <button 
                        onClick={() => console.log(`View Live action for content ID: ${content.id}`)}
                        className="inline-flex items-center hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Live
                      </button>
                      <button 
                        onClick={() => console.log(`Analytics action for content ID: ${content.id}`)}
                        className="inline-flex items-center hover:text-primary-600 transition-colors"
                      >
                        <BarChart2 className="w-4 h-4 mr-1" />
                        Analytics
                      </button>
                    </div>
                    
                    <div className="flex items-center mt-3 sm:mt-0">
                      <span className="text-xs text-success-600 font-medium flex items-center">
                        <BarChart2 className="w-3 h-3 mr-1" />
                        1.2K views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No published content found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterPlatform !== 'all'
                ? "No content matches your current filters"
                : "You haven't published any content yet"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                to="/drafts" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-gray-700 rounded-md font-medium"
              >
                View My Drafts
              </Link>
              <Link 
                to="/editor" 
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 transition-colors text-white rounded-md font-medium"
              >
                Create New Content
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Published;