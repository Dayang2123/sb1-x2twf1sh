import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { PlatformAccount } from '../../data/mockData';

interface PlatformStatusCardProps {
  platformAccounts: PlatformAccount[];
}

const PlatformStatusCard: React.FC<PlatformStatusCardProps> = ({ platformAccounts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-slide-up">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Platform Accounts</h3>
      <div className="space-y-4">
        {platformAccounts.map(account => (
          <div 
            key={account.id} 
            className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <img
                src={account.avatarUrl}
                alt={account.platformName}
                className="w-8 h-8 rounded-full object-cover mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{account.platformName}</p>
                <p className="text-xs text-gray-500">{account.username}</p>
              </div>
            </div>
            <div className="flex items-center">
              {account.isConnected ? (
                <span className="inline-flex items-center text-success-600 text-xs font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Connected
                </span>
              ) : (
                <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
        <button className="w-full mt-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-dashed border-gray-200 rounded-md hover:border-primary-300 transition-colors">
          + Add new platform
        </button>
      </div>
    </div>
  );
};

export default PlatformStatusCard;