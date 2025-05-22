import React, { createContext, useState } from 'react';
import { Content, PlatformAccount, mockData } from '../data/mockData';

export interface AppContextType { // Exporting AppContextType
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
  connectPlatformAccount: (platformId: string) => void;
  disconnectPlatformAccount: (platformId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined); // Exporting AppContext

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

  const connectPlatformAccount = (platformId: string) => {
    console.log(`Attempting to connect platform: ${platformId}`);
    setPlatformAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.id === platformId
          ? { ...account, isConnected: true, username: 'ConnectedUser' }
          : account
      )
    );
  };

  const disconnectPlatformAccount = (platformId: string) => {
    console.log(`Attempting to disconnect platform: ${platformId}`);
    setPlatformAccounts(prevAccounts =>
      prevAccounts.map(account =>
        account.id === platformId
          ? { ...account, isConnected: false, username: 'User' }
          : account
      )
    );
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
    connectPlatformAccount,
    disconnectPlatformAccount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};