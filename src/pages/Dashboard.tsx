import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { PenSquare, Clock, Send, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';
import ContentCard from '../components/Content/ContentCard';
import AnalyticsCard from '../components/Dashboard/AnalyticsCard';
import PlatformStatusCard from '../components/Dashboard/PlatformStatusCard';
import RecentActivityCard from '../components/Dashboard/RecentActivityCard';

const Dashboard: React.FC = () => {
  const { recentDrafts, publishedContents, platformAccounts } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

  // Analytics mock data
  const overviewStats = [
    { title: 'Total Content', value: publishedContents.length + recentDrafts.length, icon: <PenSquare className="w-5 h-5" />, change: '+12%', color: 'bg-primary-100 text-primary-600' },
    { title: 'Published', value: publishedContents.length, icon: <Send className="w-5 h-5" />, change: '+5%', color: 'bg-success-100 text-success-600' },
    { title: 'Drafts', value: recentDrafts.length, icon: <Clock className="w-5 h-5" />, change: '-3%', color: 'bg-warning-100 text-warning-600' },
    { title: 'Active Platforms', value: platformAccounts.filter(a => a.isConnected).length, icon: <BarChart2 className="w-5 h-5" />, change: '+2', color: 'bg-secondary-100 text-secondary-600' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-600 mt-1">Here's what's happening with your content today</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link 
            to="/editor" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 transition-colors text-white rounded-md font-medium shadow-sm"
          >
            Create New Content
            <PenSquare className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-slide-up" 
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-success-600' : 'text-error-600'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 font-medium border-b-2 ${
            activeTab === 'overview' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } transition-colors`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-4 font-medium border-b-2 ${
            activeTab === 'analytics' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } transition-colors`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Recent Drafts</h3>
                <Link to="/drafts" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentDrafts.length > 0 ? (
                  recentDrafts.map(draft => (
                    <ContentCard key={draft.id} content={draft} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No drafts yet</p>
                    <Link 
                      to="/editor" 
                      className="inline-flex items-center mt-3 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md font-medium text-sm transition-colors"
                    >
                      Create your first draft
                      <PenSquare className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <PlatformStatusCard platformAccounts={platformAccounts} />
            <RecentActivityCard />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsCard />
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-slide-up">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Top Performing Content</h3>
              <div className="space-y-4">
                {publishedContents.slice(0, 3).map((content, index) => (
                  <div key={content.id} className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-white ${
                      index === 0 ? 'bg-primary-500' : index === 1 ? 'bg-primary-400' : 'bg-primary-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{content.title}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {content.publishedPlatforms?.length || 0} platforms
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(content.publishedAt || '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-success-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">+24%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;