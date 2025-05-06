import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Send, Calendar, Clock, CheckCircle } from 'lucide-react';

interface PublishModalProps {
  onClose: () => void;
  contentId: string;
}

const PublishModal: React.FC<PublishModalProps> = ({ onClose, contentId }) => {
  const navigate = useNavigate();
  const { platformAccounts, publishContent } = useAppContext();
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleOption, setScheduleOption] = useState<'now' | 'later'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePlatformSelect = (platformName: string) => {
    if (selectedPlatforms.includes(platformName)) {
      setSelectedPlatforms(selectedPlatforms.filter(name => name !== platformName));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformName]);
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    
    // Simulate publishing delay
    setTimeout(() => {
      publishContent(contentId, selectedPlatforms);
      setIsPublishing(false);
      setIsSuccess(true);
      
      // Navigate to published after success
      setTimeout(() => {
        onClose();
        navigate('/published');
      }, 1500);
    }, 2000);
  };

  // Get today's date in YYYY-MM-DD format for the date input min
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slide-up">
        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Successfully Published!</h3>
            <p className="text-gray-600 mb-6">
              Your content has been published to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}.
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
            >
              View Published Content
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Send className="w-5 h-5 text-primary-500 mr-2" />
                Publish Content
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select platforms to publish to:</h4>
                <div className="space-y-3">
                  {platformAccounts.map(account => (
                    <label key={account.id} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(account.platformName)}
                        onChange={() => handlePlatformSelect(account.platformName)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        disabled={!account.isConnected}
                      />
                      <div className="ml-3 flex items-center">
                        <img
                          src={account.avatarUrl}
                          alt={account.platformName}
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className={`text-sm font-medium ${account.isConnected ? 'text-gray-800' : 'text-gray-400'}`}>
                            {account.platformName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {account.isConnected ? account.username : 'Not connected'}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">When to publish:</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="scheduleOption"
                      checked={scheduleOption === 'now'}
                      onChange={() => setScheduleOption('now')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center">
                      <Clock className="w-5 h-5 text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-800">Publish now</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="scheduleOption"
                      checked={scheduleOption === 'later'}
                      onChange={() => setScheduleOption('later')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center">
                      <Calendar className="w-5 h-5 text-primary-500 mr-2" />
                      <p className="text-sm font-medium text-gray-800">Schedule for later</p>
                    </div>
                  </label>
                </div>
                
                {scheduleOption === 'later' && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="scheduleDate" className="block text-xs font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        id="scheduleDate"
                        min={today}
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="scheduleTime" className="block text-xs font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        id="scheduleTime"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
              <button
                onClick={handlePublish}
                disabled={selectedPlatforms.length === 0 || isPublishing || (scheduleOption === 'later' && (!scheduleDate || !scheduleTime))}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  selectedPlatforms.length === 0 || isPublishing || (scheduleOption === 'later' && (!scheduleDate || !scheduleTime))
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } transition-colors`}
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {scheduleOption === 'now' ? 'Publish Now' : 'Schedule'}
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isPublishing}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublishModal;