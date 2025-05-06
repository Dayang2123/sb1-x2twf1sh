import React, { createContext, useContext, useState, useEffect } from 'react';
import { Content, PlatformAccount, mockData } from '../data/mockData';

interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  contents: Content[];
  recentDrafts: Content[];
  publishedContents: Content[];
  platformAccounts: PlatformAccount[];
  currentContent: Content | null;
  setCurrentContent: (content: Content | null) => void;
  saveContent: (content: Content) => void;
  deleteContent: (id: string) => void;
  publishContent: (contentId: string, platforms: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contents, setContents] = useState<Content[]>(mockData.contents);
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>(mockData.platformAccounts);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const recentDrafts = contents.filter(content => content.status === 'draft')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const publishedContents = contents.filter(content => content.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());

  const saveContent = (content: Content) => {
    const updatedContent = {
      ...content,
      updatedAt: new Date().toISOString()
    };
    
    const newContents = contents.map(c => 
      c.id === content.id ? updatedContent : c
    );
    
    if (!newContents.find(c => c.id === content.id)) {
      newContents.push(updatedContent);
    }
    
    setContents(newContents);
    setCurrentContent(updatedContent);
  };

  const deleteContent = (id: string) => {
    setContents(contents.filter(content => content.id !== id));
    if (currentContent?.id === id) {
      setCurrentContent(null);
    }
  };

  const publishContent = (contentId: string, platforms: string[]) => {
    // Simulate publishing to platforms
    setContents(contents.map(content => {
      if (content.id === contentId) {
        return {
          ...content,
          status: 'published',
          publishedAt: new Date().toISOString(),
          publishedPlatforms: platforms,
        };
      }
      return content;
    }));
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
    contents,
    recentDrafts,
    publishedContents,
    platformAccounts,
    currentContent,
    setCurrentContent,
    saveContent,
    deleteContent,
    publishContent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};