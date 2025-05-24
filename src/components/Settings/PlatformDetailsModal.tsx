import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PlatformAccount } from '../../data/mockData'; // Assuming PlatformAccount is exported

interface PlatformDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (platformData: Partial<PlatformAccount>) => void; // Using Partial for now
  initialData?: Partial<PlatformAccount>;
}

const PlatformDetailsModal: React.FC<PlatformDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [platformType, setPlatformType] = useState('Generic');
  const [platformName, setPlatformName] = useState('');
  const [username, setUsername] = useState(''); // Added username as it's a required field in PlatformAccount
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');

  useEffect(() => {
    if (initialData) {
      setPlatformType(initialData.platformName === 'WeChat' ? 'WeChat' : 'Generic'); // Simple type detection
      setPlatformName(initialData.platformName || '');
      setUsername(initialData.username || '');
      setAppId(initialData.appId || '');
      setAppSecret(initialData.appSecret || '');
    } else {
      // Reset form for new entry
      setPlatformType('Generic');
      setPlatformName('');
      setUsername('');
      setAppId('');
      setAppSecret('');
    }
  }, [initialData, isOpen]); // Depend on isOpen to reset form when re-opened without initialData

  const handleSubmit = () => {
    const dataToSave: Partial<PlatformAccount> = {
      platformName: platformName,
      username: username,
      // isConnected and avatarUrl will be set by default in context or later
    };

    if (platformType === 'WeChat') {
      dataToSave.appId = appId;
      dataToSave.appSecret = appSecret;
      // Potentially override platformName for WeChat if it's fixed
      // dataToSave.platformName = 'WeChat Official Account'; 
    }
    
    if (!platformName.trim() || !username.trim()) {
      alert("Platform Name and Username are required."); // Basic validation
      return;
    }

    onSave(dataToSave);
    onClose(); // Close modal after save
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800">
            {initialData ? 'Edit Platform' : 'Add New Platform'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="platformType" className="block text-sm font-medium text-gray-700 mb-1">
              Platform Type
            </label>
            <select
              id="platformType"
              value={platformType}
              onChange={(e) => setPlatformType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Generic">Generic</option>
              <option value="WeChat">WeChat Official Account</option>
              {/* Add other platform types here */}
            </select>
          </div>

          <div>
            <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-1">
              Platform Display Name
            </label>
            <input
              type="text"
              id="platformName"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              placeholder="e.g., My Personal Blog"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username / ID
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., @username or login ID"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {platformType === 'WeChat' && (
            <>
              <div>
                <label htmlFor="appId" className="block text-sm font-medium text-gray-700 mb-1">
                  App ID (WeChat)
                </label>
                <input
                  type="text"
                  id="appId"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="Enter WeChat App ID"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="appSecret" className="block text-sm font-medium text-gray-700 mb-1">
                  App Secret (WeChat)
                </label>
                <input
                  type="password"
                  id="appSecret"
                  value={appSecret}
                  onChange={(e) => setAppSecret(e.target.value)}
                  placeholder="Enter WeChat App Secret"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Save Platform
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformDetailsModal;
