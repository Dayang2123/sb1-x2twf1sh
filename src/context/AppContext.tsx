import React, { createContext, useState } from 'react';
import { Content, PlatformAccount, mockData, generateId } from '../data/mockData'; // Added generateId

// localStorage keys
const LOCAL_STORAGE_KEYS = {
  CONTENTS: 'appContents',
  PLATFORM_ACCOUNTS: 'appPlatformAccounts',
};

// Helper functions for localStorage
const getItemFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue) as T;
    }
  } catch (error) {
    console.error(`Error parsing localStorage item ${key}:`, error);
  }
  return defaultValue;
};

const setItemInLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
};

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
  addPlatformAccount: (platformName: string) => void; // Added for new platforms
}

export const AppContext = createContext<AppContextType | undefined>(undefined); // Exporting AppContext

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contents, setContents] = useState<Content[]>(() =>
    getItemFromLocalStorage(LOCAL_STORAGE_KEYS.CONTENTS, mockData.contents)
  );
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>(
    () =>
      getItemFromLocalStorage(
        LOCAL_STORAGE_KEYS.PLATFORM_ACCOUNTS,
        mockData.platformAccounts
      )
  );
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
    setItemInLocalStorage(LOCAL_STORAGE_KEYS.CONTENTS, newContents);
    setCurrentContent(updatedContent);
  };

  const deleteContent = (id: string) => {
    const newContents = contents.filter(content => content.id !== id);
    setContents(newContents);
    setItemInLocalStorage(LOCAL_STORAGE_KEYS.CONTENTS, newContents);
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
    });
    setContents(newContents);
    setItemInLocalStorage(LOCAL_STORAGE_KEYS.CONTENTS, newContents);
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
    setItemInLocalStorage(LOCAL_STORAGE_KEYS.PLATFORM_ACCOUNTS, updatedAccounts);
  };

  const disconnectPlatformAccount = (platformId: string) => {
    console.log(`Attempting to disconnect platform: ${platformId}`);
    const updatedAccounts = platformAccounts.map(account => // Corrected to use updatedAccounts
      account.id === platformId
        ? { ...account, isConnected: false, username: 'User' }
        : account
    );
    setPlatformAccounts(updatedAccounts);
    setItemInLocalStorage(LOCAL_STORAGE_KEYS.PLATFORM_ACCOUNTS, updatedAccounts);
  };

  const addPlatformAccount = (platformName: string) => {
    const newAccount: PlatformAccount = {
      id: generateId(),
      platformName: platformName.trim(),
      username: 'New User', // Default username
      isConnected: false,
      avatarUrl: 'https://images.pexels.com/photos/326541/pexels-photo-326541.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=50', // Default avatar
    };
    const updatedAccounts = [...platformAccounts, newAccount];
    setPlatformAccounts(updatedAccounts);
    setItemInLocalStorage(LOCAL_STORAGE_KEYS.PLATFORM_ACCOUNTS, updatedAccounts);
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
    addPlatformAccount, // Added for new platforms
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};