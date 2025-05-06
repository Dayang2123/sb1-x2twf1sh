import React from 'react';
import { Clock, Edit, Send, Image, Award } from 'lucide-react';

const RecentActivityCard: React.FC = () => {
  // Mock data for recent activities
  const activities = [
    { 
      id: 1, 
      type: 'edit', 
      content: 'Draft updated: "The Future of Artificial Intelligence"', 
      time: '2 hours ago',
      icon: <Edit className="w-4 h-4" />,
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      id: 2, 
      type: 'publish', 
      content: 'Published to Medium: "10 Effective Ways to Improve Productivity"', 
      time: '1 day ago',
      icon: <Send className="w-4 h-4" />,
      color: 'bg-success-100 text-success-600'
    },
    { 
      id: 3, 
      type: 'image', 
      content: 'Generated 2 new images for "Sustainable Living" article', 
      time: '2 days ago',
      icon: <Image className="w-4 h-4" />,
      color: 'bg-secondary-100 text-secondary-600'
    },
    { 
      id: 4, 
      type: 'milestone', 
      content: 'Reached 1,000 views on your Medium articles', 
      time: '1 week ago',
      icon: <Award className="w-4 h-4" />,
      color: 'bg-warning-100 text-warning-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-slide-up">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-100"></div>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="relative flex pl-8 animate-fade-in">
              <div className={`absolute left-0 p-1.5 rounded-full ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{activity.content}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-gray-200 rounded-md hover:border-primary-300 transition-colors">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivityCard;