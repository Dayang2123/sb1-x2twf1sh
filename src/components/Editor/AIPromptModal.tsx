import React, { useState } from 'react';
import { Sparkles, X, Copy } from 'lucide-react';
import { generateContentFromAI, AIConfig } from '../../services/aiService';
import { loadAIConfig } from '../../services/configService'; // Import loadAIConfig

interface AIPromptModalProps {
  onClose: () => void;
  onGenerate: (content: string) => void;
  currentContent: string;
}

const AIPromptModal: React.FC<AIPromptModalProps> = ({ 
  onClose, 
  onGenerate,
  currentContent 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);

  // mockConfig is removed

  const predefinedPrompts = [
    {
      title: "Expand current section",
      text: "Expand on the above section with more details and examples."
    },
    {
      title: "Generate conclusion",
      text: "Write a compelling conclusion that summarizes the key points of this article."
    },
    {
      title: "Create introduction",
      text: "Write an engaging introduction for an article with this title."
    },
    {
      title: "Add SEO keywords",
      text: "Suggest 10 SEO keywords relevant to this content."
    }
  ];

  const handlePromptSelect = (promptText: string) => {
    setSelectedPrompt(promptText);
    setPrompt(promptText);
  };

  const handleGenerate = async () => {
    setErrorState(null);
    setGeneratedContent('');
    setIsLoading(true);

    try {
      let effectiveConfig = loadAIConfig();
      if (!effectiveConfig) {
        // Fallback to default/empty config if nothing is saved
        // aiService.ts should handle errors if critical fields like apiUrl are missing
        effectiveConfig = { 
          apiKey: '', 
          apiUrl: '', 
          model: 'default-model' // Provide a default model or let aiService handle it
        };
        console.warn("AIPromptModal: AI config not found in localStorage, using fallback. Please configure in Settings.");
      }
      
      // Ensure all required fields are present, even if empty, to match AIConfig interface
      const configForService: AIConfig = {
        apiKey: effectiveConfig.apiKey || '',
        apiUrl: effectiveConfig.apiUrl || '',
        model: effectiveConfig.model || 'default-model', // Ensure model is not empty
      };

      const result = await generateContentFromAI(prompt, currentContent, configForService);
      setGeneratedContent(result);
    } catch (error) {
      if (error instanceof Error) {
        setErrorState(error.message);
      } else {
        setErrorState('An unknown error occurred during AI generation.');
      }
      console.error("Error generating AI content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseContent = () => {
    onGenerate(generatedContent);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col animate-slide-up">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <Sparkles className="w-5 h-5 text-secondary-500 mr-2" />
            AI Content Assistant
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {!generatedContent ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                What kind of content would you like to generate? Provide a prompt or select from common options.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {predefinedPrompts.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptSelect(item.text)}
                    className={`p-3 text-left border rounded-md text-sm hover:shadow-sm transition-all ${
                      selectedPrompt === item.text
                        ? 'border-secondary-400 bg-secondary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-gray-500 mt-1 text-xs">{item.text.substring(0, 60)}...</p>
                  </button>
                ))}
              </div>
              
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom prompt:
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what kind of content you need..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                  rows={4}
                />
              </div>
              
              {errorState && (
                <div className="my-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  <strong>Error:</strong> {errorState}
                </div>
              )}

              <div className="text-sm text-gray-500 mt-2 mb-4">
                <p>Content context (excerpt from your current draft):</p>
                <div className="mt-2 p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
                  {currentContent ? currentContent.substring(0, 200) + '...' : 'No content yet.'}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Generated Content:</h4>
                <button 
                  onClick={handleCopyContent}
                  className="flex items-center text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap">
                {generatedContent}
              </div>
            </>
          )}
          {errorState && !generatedContent && ( // Also show error here if generation fails and there's no old content
             <div className="my-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
               <strong>Error:</strong> {errorState}
             </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
          {!generatedContent ? (
            <button
              onClick={handleGenerate}
              disabled={!prompt || isLoading}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                !prompt || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-secondary-600 text-white hover:bg-secondary-700'
              } transition-colors`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleUseContent}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Use This Content
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPromptModal;