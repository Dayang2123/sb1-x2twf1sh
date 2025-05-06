import React, { useState } from 'react';
import { Sparkles, X, Copy } from 'lucide-react';

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

  const handleGenerate = () => {
    setIsLoading(true);
    
    // Simulating API call to AI service
    setTimeout(() => {
      let result = '';
      
      if (prompt.includes('conclusion')) {
        result = `## Conclusion\n\nIn conclusion, the topics we've explored highlight the importance of staying adaptable and forward-thinking in our rapidly evolving world. By embracing new technologies while maintaining a critical perspective, we can harness their potential while mitigating risks. Remember that success comes not just from adopting innovations, but from thoughtfully integrating them into our existing systems and values.\n\nThe journey toward improvement is ongoing, and each step forward opens new possibilities. As we continue to explore and implement these ideas, we contribute to a collective knowledge base that benefits everyone. Thank you for engaging with this content, and I encourage you to apply these insights in ways that are meaningful to your specific context.`;
      } else if (prompt.includes('introduction')) {
        result = `## Introduction\n\nIn today's fast-paced digital landscape, staying ahead of trends and innovations is more crucial than ever. This article delves into cutting-edge developments that are reshaping how we think about technology, business, and everyday life. Whether you're a seasoned professional or simply curious about what's on the horizon, the insights shared here will provide valuable perspective on navigating our increasingly complex world.\n\nWe'll explore not only what's changing, but why these changes matter and how they might affect different aspects of society. By understanding the driving forces behind these innovations, we can better prepare for the future and perhaps even help shape it. Let's embark on this exploration together, with both excitement for the possibilities and thoughtfulness about their implications.`;
      } else if (prompt.includes('SEO keywords')) {
        result = `## Recommended SEO Keywords\n\n1. Digital transformation\n2. Innovation strategies\n3. Future technology trends\n4. Business adaptation\n5. Tech industry development\n6. Emerging technologies\n7. Digital disruption\n8. Technology integration\n9. Future-proofing business\n10. Technology impact analysis`;
      } else {
        result = `The integration of artificial intelligence into content creation represents a significant paradigm shift in how we produce and consume media. This technology offers unprecedented efficiency by automating routine aspects of content generation while allowing human creators to focus on strategic and creative elements that require nuanced understanding and emotional intelligence.\n\nFor instance, AI systems can now analyze vast datasets to identify trending topics, audience preferences, and effective content patterns. This capability enables content creators to develop more targeted materials that resonate with specific demographics. Furthermore, AI-assisted editing tools can enhance readability, suggest stylistic improvements, and ensure consistency across multiple pieces of content.\n\nHowever, it's important to recognize that AI augments rather than replaces human creativity. The most effective content strategies leverage AI as a collaborative tool, combining algorithmic efficiency with human insight, ethical judgment, and emotional connection. This balanced approach results in content that is both data-informed and authentically engaging.`;
      }
      
      setGeneratedContent(result);
      setIsLoading(false);
    }, 2000);
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