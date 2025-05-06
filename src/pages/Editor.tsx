import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { createNewContent, generateId } from '../data/mockData';
import { Save, Image, Sparkles, Send, X, Plus, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AIPromptModal from '../components/Editor/AIPromptModal';
import PublishModal from '../components/Editor/PublishModal';
import ImageGallery from '../components/Editor/ImageGallery';

const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contents, currentContent, setCurrentContent, saveContent } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Load content if editing an existing one
  useEffect(() => {
    if (id) {
      const foundContent = contents.find(c => c.id === id);
      if (foundContent) {
        setCurrentContent(foundContent);
        setTitle(foundContent.title);
        setContent(foundContent.content);
      } else {
        navigate('/editor');
      }
    } else {
      const newContent = createNewContent();
      setCurrentContent(newContent);
      setTitle(newContent.title);
      setContent(newContent.content);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [id, contents, setCurrentContent, navigate]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (currentContent && (title !== currentContent.title || content !== currentContent.content)) {
      const timer = setTimeout(() => {
        handleSave(true);
      }, 5000);
      
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [title, content]);

  const handleSave = (isAutoSave = false) => {
    if (!currentContent) return;
    
    if (!isAutoSave) {
      setIsSaving(true);
    }

    const updatedContent = {
      ...currentContent,
      title,
      content,
      updatedAt: new Date().toISOString()
    };

    saveContent(updatedContent);
    
    if (!isAutoSave) {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  const addImageToContent = (imageUrl: string, alt: string) => {
    const imageMarkdown = `\n\n![${alt}](${imageUrl})\n\n`;
    const newContent = content + imageMarkdown;
    setContent(newContent);
    setIsImageGalleryOpen(false);
  };

  const appendAIContent = (generatedContent: string) => {
    setContent(prevContent => {
      return prevContent ? `${prevContent}\n\n${generatedContent}` : generatedContent;
    });
    setIsAIPromptOpen(false);
  };

  const handleAddSection = () => {
    const newSection = `\n\n## New Section\n\nWrite your content here...\n\n`;
    setContent(prevContent => prevContent + newSection);
  };

  if (!currentContent) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="w-full text-3xl font-serif font-bold text-gray-800 border-none focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsImageGalleryOpen(true)}
            className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            <Image className="w-4 h-4 mr-1.5" />
            Images
          </button>
          <button
            onClick={() => setIsAIPromptOpen(true)}
            className="flex items-center px-3 py-1.5 border border-secondary-300 bg-secondary-50 rounded-md text-secondary-700 text-sm hover:bg-secondary-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            AI Assist
          </button>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className={`flex items-center px-4 py-1.5 border ${
              isSaving ? 'bg-success-50 border-success-300 text-success-700' : 'bg-primary-50 border-primary-300 text-primary-700 hover:bg-primary-100'
            } rounded-md text-sm transition-colors`}
          >
            {isSaving ? (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Save
              </>
            )}
          </button>
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center px-4 py-1.5 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex space-x-3 mb-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('write')}
          className={`py-2 px-4 border-b-2 font-medium ${
            selectedTab === 'write' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } transition-colors`}
        >
          Write
        </button>
        <button
          onClick={() => setSelectedTab('preview')}
          className={`py-2 px-4 border-b-2 font-medium ${
            selectedTab === 'preview' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } transition-colors`}
        >
          Preview
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {selectedTab === 'write' ? (
          <div className="relative flex flex-col h-full">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your content here..."
              className="flex-1 p-4 text-gray-800 focus:outline-none focus:ring-0 border-0 resize-none font-medium"
            />
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={handleAddSection}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                title="Add section"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAIPromptOpen(true)}
                className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 text-secondary-700 transition-colors"
                title="AI suggestions"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsImageGalleryOpen(true)}
                className="p-2 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-700 transition-colors"
                title="Add image"
              >
                <Image className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-full shadow-sm">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">{title || "Untitled Content"}</h1>
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || "No content yet. Start writing in the editor."}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {isAIPromptOpen && (
        <AIPromptModal 
          onClose={() => setIsAIPromptOpen(false)} 
          onGenerate={appendAIContent}
          currentContent={content}
        />
      )}

      {isPublishModalOpen && (
        <PublishModal 
          onClose={() => setIsPublishModalOpen(false)} 
          contentId={currentContent.id}
        />
      )}

      {isImageGalleryOpen && (
        <ImageGallery 
          onClose={() => setIsImageGalleryOpen(false)} 
          onSelectImage={addImageToContent}
        />
      )}
    </div>
  );
};

export default Editor;