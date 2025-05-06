import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Shield, Zap, BellRing, ExternalLink, CheckCircle, XCircle, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { platformAccounts } = useAppContext();
  const [activeTab, setActiveTab] = useState<'account' | 'platforms' | 'ai' | 'notifications'>('account');
  
  // Mock user settings
  const [userSettings, setUserSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    notificationsEnabled: true,
    emailDigest: 'weekly',
    defaultPublishPlatforms: ['Medium', 'WordPress'],
    aiSettings: {
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.7,
      savePrompts: true
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account preferences and platform connections</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('account')}
            className={`py-4 px-6 text-sm font-medium flex items-center ${
              activeTab === 'account' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
          >
            <User className="w-4 h-4 mr-2" />
            Account
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`py-4 px-6 text-sm font-medium flex items-center ${
              activeTab === 'platforms' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Platforms
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-4 px-6 text-sm font-medium flex items-center ${
              activeTab === 'ai' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
          >
            <Zap className="w-4 h-4 mr-2" />
            AI Settings
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 px-6 text-sm font-medium flex items-center ${
              activeTab === 'notifications' 
                ? 'border-b-2 border-primary-600 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
          >
            <BellRing className="w-4 h-4 mr-2" />
            Notifications
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'account' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
              
              <div className="space-y-6 max-w-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-0">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Profile Picture</h4>
                    <div className="mt-2 flex space-x-3">
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Upload New
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userSettings.name}
                    onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Change Password
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      isSaving
                        ? 'bg-success-100 text-success-700 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    } transition-colors`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'platforms' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Connect Content Platforms</h3>
              <p className="text-sm text-gray-600 mb-6">
                Connect your accounts to publish content directly to these platforms.
              </p>
              
              <div className="space-y-4 max-w-3xl">
                {platformAccounts.map(account => (
                  <div 
                    key={account.id} 
                    className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <div className="flex items-center mb-3 sm:mb-0">
                      <img
                        src={account.avatarUrl}
                        alt={account.platformName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">{account.platformName}</h4>
                        <p className="text-sm text-gray-500">
                          {account.isConnected ? `Connected as ${account.username}` : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {account.isConnected ? (
                        <div className="flex space-x-3">
                          <button className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Refresh Token
                          </button>
                          <button className="px-3 py-1 border border-error-300 text-error-700 rounded-md text-xs font-medium hover:bg-error-50 transition-colors">
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs font-medium hover:bg-primary-700 transition-colors">
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-3 py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  + Add New Platform
                </button>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Default Publishing Settings</h3>
                
                <div className="max-w-3xl">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default platforms for publishing
                    </label>
                    <div className="space-y-2">
                      {platformAccounts.map(account => (
                        <label key={account.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={userSettings.defaultPublishPlatforms.includes(account.platformName)}
                            onChange={(e) => {
                              const platforms = e.target.checked
                                ? [...userSettings.defaultPublishPlatforms, account.platformName]
                                : userSettings.defaultPublishPlatforms.filter(p => p !== account.platformName);
                              setUserSettings({...userSettings, defaultPublishPlatforms: platforms});
                            }}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            disabled={!account.isConnected}
                          />
                          <span className={`ml-2 text-sm ${account.isConnected ? 'text-gray-700' : 'text-gray-400'}`}>
                            {account.platformName}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        isSaving
                          ? 'bg-success-100 text-success-700 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      } transition-colors`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'ai' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium text-gray-800 mb-4">AI Content Generation Settings</h3>
              <p className="text-sm text-gray-600 mb-6">
                Configure how the AI generates content for your articles.
              </p>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 mb-1">
                    AI Model
                  </label>
                  <select
                    id="aiModel"
                    value={userSettings.aiSettings.model}
                    onChange={(e) => setUserSettings({
                      ...userSettings, 
                      aiSettings: {...userSettings.aiSettings, model: e.target.value}
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="gpt-4">GPT-4 (Highest quality, slower)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast, good quality)</option>
                    <option value="claude-2">Claude 2 (Alternative model)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Length (tokens)
                  </label>
                  <input
                    type="range"
                    id="maxTokens"
                    min="500"
                    max="4000"
                    step="100"
                    value={userSettings.aiSettings.maxTokens}
                    onChange={(e) => setUserSettings({
                      ...userSettings, 
                      aiSettings: {...userSettings.aiSettings, maxTokens: parseInt(e.target.value)}
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Short (500)</span>
                    <span>Current: {userSettings.aiSettings.maxTokens}</span>
                    <span>Long (4000)</span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                    Creativity Level
                  </label>
                  <input
                    type="range"
                    id="temperature"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={userSettings.aiSettings.temperature}
                    onChange={(e) => setUserSettings({
                      ...userSettings, 
                      aiSettings: {...userSettings.aiSettings, temperature: parseFloat(e.target.value)}
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative (0.1)</span>
                    <span>Current: {userSettings.aiSettings.temperature}</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.aiSettings.savePrompts}
                      onChange={(e) => setUserSettings({
                        ...userSettings, 
                        aiSettings: {...userSettings.aiSettings, savePrompts: e.target.checked}
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Save prompts history for future use</span>
                  </label>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      isSaving
                        ? 'bg-success-100 text-success-700 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    } transition-colors`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
              <p className="text-sm text-gray-600 mb-6">
                Control how and when you receive notifications about your content.
              </p>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userSettings.notificationsEnabled}
                      onChange={(e) => setUserSettings({...userSettings, notificationsEnabled: e.target.checked})}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable all notifications</span>
                  </label>
                </div>
                
                <div className="pl-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Publishing Status</h4>
                      <p className="text-xs text-gray-500">Notify when content is published successfully or fails</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" disabled={!userSettings.notificationsEnabled} />
                      <div className={`w-11 h-6 ${userSettings.notificationsEnabled ? 'bg-gray-200 peer-focus:ring-primary-300 peer-checked:bg-primary-600' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Content Performance</h4>
                      <p className="text-xs text-gray-500">Get updates when your content reaches new milestones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" disabled={!userSettings.notificationsEnabled} />
                      <div className={`w-11 h-6 ${userSettings.notificationsEnabled ? 'bg-gray-200 peer-focus:ring-primary-300 peer-checked:bg-primary-600' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Platform Connections</h4>
                      <p className="text-xs text-gray-500">Notify about connection issues or token expirations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" disabled={!userSettings.notificationsEnabled} />
                      <div className={`w-11 h-6 ${userSettings.notificationsEnabled ? 'bg-gray-200 peer-focus:ring-primary-300 peer-checked:bg-primary-600' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="emailDigest" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Digest Frequency
                  </label>
                  <select
                    id="emailDigest"
                    value={userSettings.emailDigest}
                    onChange={(e) => setUserSettings({...userSettings, emailDigest: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                    disabled={!userSettings.notificationsEnabled}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      isSaving
                        ? 'bg-success-100 text-success-700 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    } transition-colors`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;