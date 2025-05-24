import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/useAppContext';
import { User, Zap, BellRing, ExternalLink, Save, KeyRound, Server } from 'lucide-react'; // Added KeyRound, Server
import PlatformDetailsModal from '../components/Settings/PlatformDetailsModal';
import { PlatformAccount } from '../data/mockData';
import { loadAIConfig, saveAIConfig, loadNewsConfig, saveNewsConfig, AIConfig, NewsConfig } from '../services/configService'; // Import config service

const USER_SETTINGS_KEY = 'userAppSettings';

const Settings: React.FC = () => {
  const { platformAccounts, connectPlatformAccount, disconnectPlatformAccount, addPlatformAccount } = useAppContext();
  const [activeTab, setActiveTab] = useState<'account' | 'platforms' | 'ai' | 'notifications'>('account');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false); // State for modal
  
  // User settings with new notification options and profile picture URL
  const defaultSettings = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePictureUrl: '',
    notificationsEnabled: true,
    notificationsPublishing: true,
    notificationsContentPerformance: false,
    notificationsPlatformConnections: false,
    emailDigest: 'weekly',
    defaultPublishPlatforms: ['Medium', 'WordPress'],
    // aiSettings section might be deprecated by new AIConfig from configService
    // For now, keep it to avoid breaking other parts of the UI if they use it,
    // but new AI API Key/URL/Model will be handled separately.
    aiSettings: { 
      model: 'gpt-4', // This might become a default if no specific AIConfig is saved
      maxTokens: 2000,
      temperature: 0.7,
      savePrompts: true
    }
  };
  const [userSettings, setUserSettings] = useState(defaultSettings);

  // States for AI API Configuration
  const [aiApiKeyInput, setAiApiKeyInput] = useState('');
  const [aiApiUrlInput, setAiApiUrlInput] = useState('');
  const [aiModelNameInput, setAiModelNameInput] = useState('');
  const [aiSaveMessage, setAiSaveMessage] = useState('');

  // States for News API Configuration
  const [newsApiKeyInput, setNewsApiKeyInput] = useState('');
  const [newsSaveMessage, setNewsSaveMessage] = useState('');
  
  // Load all settings from localStorage on mount
  useEffect(() => {
    // Load User Settings
    try {
      const storedUserSettings = localStorage.getItem(USER_SETTINGS_KEY);
      if (storedUserSettings) {
        const parsedSettings = JSON.parse(storedUserSettings);
        setUserSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
      }
    } catch (error) {
      console.error("Failed to load user settings from localStorage", error);
    }

    // Load AI Config
    const loadedAIConfig = loadAIConfig();
    if (loadedAIConfig) {
      setAiApiKeyInput(loadedAIConfig.apiKey);
      setAiApiUrlInput(loadedAIConfig.apiUrl);
      setAiModelNameInput(loadedAIConfig.model);
    }

    // Load News Config
    const loadedNewsConfig = loadNewsConfig();
    if (loadedNewsConfig) {
      setNewsApiKeyInput(loadedNewsConfig.apiKey);
    }
  }, []);

  const [isSaving, setIsSaving] = useState(false); // For general user settings save
  
  // Save handler for general user settings (name, email, notifications etc.)
  const handleSaveUserSettings = () => {
    setIsSaving(true);
    try {
      localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(userSettings));
    } catch (error) {
      console.error("Failed to save user settings to localStorage", error);
    }
    setTimeout(() => {
      setIsSaving(false);
      // Add feedback for user settings save if needed
    }, 1500);
  };

  const handleSaveAIConfiguration = () => {
    const config: AIConfig = {
      apiKey: aiApiKeyInput,
      apiUrl: aiApiUrlInput,
      model: aiModelNameInput,
    };
    saveAIConfig(config);
    setAiSaveMessage('AI settings saved successfully!');
    setTimeout(() => setAiSaveMessage(''), 3000);
  };

  const handleSaveNewsConfiguration = () => {
    const config: NewsConfig = {
      apiKey: newsApiKeyInput,
    };
    saveNewsConfig(config);
    setNewsSaveMessage('News API key saved successfully!');
    setTimeout(() => setNewsSaveMessage(''), 3000);
  };

  const handleRefreshToken = (platformId: string) => {
    console.log(`Refreshing token for platform: ${platformId}`);
    // Placeholder for actual token refresh logic
  };

  const handleAddPlatform = () => {
    setIsPlatformModalOpen(true); // Open the modal
  };

  const handleSavePlatform = (platformData: Partial<PlatformAccount>) => {
    console.log("Platform data to save:", platformData);
    addPlatformAccount(platformData); // Pass the whole object
    setIsPlatformModalOpen(false);
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserSettings(prev => ({ ...prev, profilePictureUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input value
      }
    }
  };

  const handleUploadNewProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveProfilePicture = () => {
    setUserSettings(prev => ({ ...prev, profilePictureUrl: '' }));
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
                {/* Hidden file input for profile picture */}
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  ref={fileInputRef} 
                  onChange={handleProfilePictureChange} 
                />
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  {/* Display profile picture or placeholder */}
                  {userSettings.profilePictureUrl ? (
                    <img 
                      src={userSettings.profilePictureUrl} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover mb-4 md:mb-0" 
                    />
                  ) : (
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-0">
                      <User className="w-8 h-8 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Profile Picture</h4>
                    <div className="mt-2 flex space-x-3">
                      <button 
                        onClick={handleUploadNewProfilePicture}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Upload New
                      </button>
                      <button 
                        onClick={handleRemoveProfilePicture}
                        className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
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
                    onClick={handleSaveUserSettings}
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
                        Save User Changes 
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'platforms' && (
            <div className="animate-fade-in">
              <PlatformDetailsModal
                isOpen={isPlatformModalOpen}
                onClose={() => setIsPlatformModalOpen(false)}
                onSave={handleSavePlatform}
              />
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
                          <button 
                            onClick={() => handleRefreshToken(account.id)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Refresh Token
                          </button>
                          <button 
                            onClick={() => disconnectPlatformAccount(account.id)}
                            className="px-3 py-1 border border-error-300 text-error-700 rounded-md text-xs font-medium hover:bg-error-50 transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => connectPlatformAccount(account.id)}
                          className="px-3 py-1 bg-primary-600 text-white rounded-md text-xs font-medium hover:bg-primary-700 transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={handleAddPlatform}
                  className="w-full mt-3 py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
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
                      onClick={handleSaveUserSettings}
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
                          Save Publishing Changes
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
              {/* AI Service API Configuration */}
              <section className="mb-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <Server className="w-5 h-5 mr-2 text-blue-600" /> AI Service Configuration
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Set up your AI provider details. These are stored locally in your browser.
                </p>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label htmlFor="aiApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      AI API Key
                    </label>
                    <input
                      type="password"
                      id="aiApiKey"
                      value={aiApiKeyInput}
                      onChange={(e) => setAiApiKeyInput(e.target.value)}
                      placeholder="Enter your AI API Key"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="aiApiUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      AI API URL
                    </label>
                    <input
                      type="text"
                      id="aiApiUrl"
                      value={aiApiUrlInput}
                      onChange={(e) => setAiApiUrlInput(e.target.value)}
                      placeholder="e.g., https://api.openai.com/v1/chat/completions"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="aiModelName" className="block text-sm font-medium text-gray-700 mb-1">
                      AI Model Name
                    </label>
                    <input
                      type="text"
                      id="aiModelName"
                      value={aiModelNameInput}
                      onChange={(e) => setAiModelNameInput(e.target.value)}
                      placeholder="e.g., gpt-3.5-turbo"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleSaveAIConfiguration}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save AI Settings
                    </button>
                    {aiSaveMessage && <p className="text-sm text-green-600">{aiSaveMessage}</p>}
                  </div>
                </div>
              </section>

              {/* News Service API Configuration */}
              <section className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <KeyRound className="w-5 h-5 mr-2 text-orange-600" /> News Service API Key (GNews)
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Set up your GNews API key. This is stored locally in your browser.
                </p>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label htmlFor="newsApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      GNews API Key
                    </label>
                    <input
                      type="password"
                      id="newsApiKey"
                      value={newsApiKeyInput}
                      onChange={(e) => setNewsApiKeyInput(e.target.value)}
                      placeholder="Enter your GNews API Key"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                  <button
                    onClick={handleSaveNewsConfiguration}
                    className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save News API Key
                  </button>
                  {newsSaveMessage && <p className="text-sm text-green-600">{newsSaveMessage}</p>}
                  </div>
                </div>
              </section>

              {/* Legacy AI Content Generation Settings (from original file) - can be removed or integrated if needed */}
              <section className="border-t border-gray-200 pt-8 mt-8 opacity-50">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Legacy AI Content Settings (Review/Integrate)</h3>
                 <p className="text-sm text-gray-600 mb-6">
                  These are older settings. Review if they need to be integrated with the new API configurations or removed.
                </p>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label htmlFor="legacyAiModel" className="block text-sm font-medium text-gray-700 mb-1">
                      AI Model (Legacy)
                    </label>
                    <select
                      id="legacyAiModel"
                      value={userSettings.aiSettings.model}
                      onChange={(e) => setUserSettings({
                        ...userSettings, 
                        aiSettings: {...userSettings.aiSettings, model: e.target.value}
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                      disabled 
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>
                   {/* Other legacy settings fields could be listed here similarly, marked as disabled */}
                </div>
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <button
                    onClick={handleSaveUserSettings} // Note: This saves the general userSettings object
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
                        Save Legacy Settings
                      </>
                    )}
                  </button>
                </div>
              </section>
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
                      <input 
                        type="checkbox" 
                        checked={userSettings.notificationsPublishing} 
                        onChange={(e) => setUserSettings({...userSettings, notificationsPublishing: e.target.checked})}
                        className="sr-only peer" 
                        disabled={!userSettings.notificationsEnabled} 
                      />
                      <div className={`w-11 h-6 ${userSettings.notificationsEnabled ? 'bg-gray-200 peer-focus:ring-primary-300 peer-checked:bg-primary-600' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Content Performance</h4>
                      <p className="text-xs text-gray-500">Get updates when your content reaches new milestones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={userSettings.notificationsContentPerformance} 
                        onChange={(e) => setUserSettings({...userSettings, notificationsContentPerformance: e.target.checked})}
                        className="sr-only peer" 
                        disabled={!userSettings.notificationsEnabled} 
                      />
                      <div className={`w-11 h-6 ${userSettings.notificationsEnabled ? 'bg-gray-200 peer-focus:ring-primary-300 peer-checked:bg-primary-600' : 'bg-gray-300'} peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Platform Connections</h4>
                      <p className="text-xs text-gray-500">Notify about connection issues or token expirations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={userSettings.notificationsPlatformConnections} 
                        onChange={(e) => setUserSettings({...userSettings, notificationsPlatformConnections: e.target.checked})}
                        className="sr-only peer" 
                        disabled={!userSettings.notificationsEnabled} 
                      />
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
                    onClick={handleSaveUserSettings}
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
                        Save Notification Changes
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