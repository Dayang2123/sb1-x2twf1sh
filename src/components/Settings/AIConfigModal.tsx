import React, { useState, useEffect, useCallback } from 'react';
import { AIConfigEntry, loadAllAIConfigs, addAIConfig, updateAIConfig, deleteAIConfig, setActiveAIConfigId, getActiveAIConfigId } from '../../services/configService';
import { X, Edit3, Trash2, PlusCircle, CheckCircle, AlertTriangle } from 'lucide-react'; // Example icons

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIConfigModal: React.FC<AIConfigModalProps> = ({ isOpen, onClose }) => {
  const [configs, setConfigs] = useState<AIConfigEntry[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<Partial<AIConfigEntry> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<AIConfigEntry | null>(null);

  const refreshConfigs = useCallback(() => {
    const allConfigs = loadAllAIConfigs();
    setConfigs(allConfigs);
    const currentActiveId = getActiveAIConfigId();
    setActiveConfigId(currentActiveId);
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshConfigs();
    }
  }, [isOpen, refreshConfigs]);

  const handleSetActive = (id: string) => {
    setActiveAIConfigId(id);
    refreshConfigs();
  };

  const handleOpenAddForm = () => {
    setCurrentConfig({ name: '', apiKey: '', apiUrl: '', model: '' });
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleOpenEditForm = (config: AIConfigEntry) => {
    setCurrentConfig({ ...config });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentConfig) {
      setCurrentConfig({ ...currentConfig, [e.target.name]: e.target.value });
    }
  };

  const handleSaveConfig = () => {
    if (!currentConfig || !currentConfig.name || !currentConfig.apiKey || !currentConfig.apiUrl || !currentConfig.model) {
      alert("Please fill in all fields."); // Basic validation
      return;
    }

    if (isAdding) {
      addAIConfig({
        name: currentConfig.name!,
        apiKey: currentConfig.apiKey!,
        apiUrl: currentConfig.apiUrl!,
        model: currentConfig.model!,
      });
    } else if (isEditing && currentConfig.id) {
      updateAIConfig(currentConfig as AIConfigEntry);
    }
    refreshConfigs();
    setIsAdding(false);
    setIsEditing(false);
    setCurrentConfig(null);
  };

  const handleDeleteConfig = (config: AIConfigEntry) => {
    deleteAIConfig(config.id);
    refreshConfigs();
    setShowDeleteConfirm(null); // Close confirmation
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentConfig(null);
  };

  const handleCloseModal = () => {
    handleCancelForm(); // Ensure form state is reset
    setShowDeleteConfirm(null); // Ensure delete confirm is reset
    onClose();
  }

  if (!isOpen) return null;

  const renderConfigForm = () => (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-700 mb-3">{isAdding ? 'Add New AI Configuration' : 'Edit AI Configuration'}</h4>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" id="name" value={currentConfig?.name || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
        <input type="password" name="apiKey" id="apiKey" value={currentConfig?.apiKey || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700">API URL</label>
        <input type="text" name="apiUrl" id="apiUrl" value={currentConfig?.apiUrl || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
        <input type="text" name="model" id="model" value={currentConfig?.model || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button onClick={handleCancelForm} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSaveConfig} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save Configuration</button>
      </div>
    </div>
  );

  const renderConfigList = () => (
    <div className="space-y-3">
      {configs.length === 0 && <p className="text-gray-500 text-center py-4">No AI configurations found. Add one to get started.</p>}
      {configs.map(config => (
        <div key={config.id} className={`p-3 border rounded-md flex items-center justify-between ${activeConfigId === config.id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <div>
            <h5 className="font-semibold text-gray-800">{config.name}</h5>
            <p className="text-sm text-gray-500">Model: {config.model}</p>
            {activeConfigId === config.id && <span className="text-xs text-green-600 font-medium flex items-center"><CheckCircle size={14} className="mr-1"/> Active</span>}
          </div>
          <div className="flex space-x-2">
            {activeConfigId !== config.id && (
              <button onClick={() => handleSetActive(config.id)} className="p-2 text-blue-500 hover:text-blue-700" title="Set as Active">
                <CheckCircle size={18} />
              </button>
            )}
            <button onClick={() => handleOpenEditForm(config)} className="p-2 text-gray-500 hover:text-gray-700" title="Edit">
              <Edit3 size={18} />
            </button>
            <button onClick={() => setShowDeleteConfirm(config)} className="p-2 text-red-500 hover:text-red-700" title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 p-4">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
          <div className="flex items-center mb-4">
            <AlertTriangle size={24} className="text-red-500 mr-3" />
            <h4 className="text-lg font-semibold text-gray-800">Confirm Deletion</h4>
          </div>
          <p className="text-gray-600 mb-5">Are you sure you want to delete the configuration "{showDeleteConfirm.name}"?</p>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={() => handleDeleteConfig(showDeleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800">Manage AI Configurations</h3>
          <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50/50">
          {isAdding || isEditing ? renderConfigForm() : renderConfigList()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-white">
           <button
            onClick={handleCloseModal}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            {isAdding || isEditing ? 'Back to List' : 'Close'}
          </button>
          {!(isAdding || isEditing) && (
            <button
              onClick={handleOpenAddForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center shadow-sm"
            >
               <PlusCircle size={18} className="inline mr-2" /> Add New Configuration
            </button>
          )}
        </div>
      </div>
      {renderDeleteConfirmation()}
    </div>
  );
};

export default AIConfigModal;
