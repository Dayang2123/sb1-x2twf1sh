import React from 'react';
import { render, act, screen } from '@testing-library/react';
import { AppProvider, AppContext, AppContextType } from './AppContext';
import { PlatformAccount } from '../data/mockData';

// Mock localStorage for testing if not already handled by JSDOM
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AppContext - Platform Accounts', () => {
  let contextValue: AppContextType | undefined;

  // Helper component to consume context and assign to contextValue
  const TestConsumer: React.FC = () => {
    contextValue = React.useContext(AppContext);
    return null; // This component doesn't render anything itself
  };

  beforeEach(() => {
    // Reset contextValue and localStorage before each test for isolation
    contextValue = undefined;
    localStorageMock.clear();
    // Re-render AppProvider for each test to ensure fresh state
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );
    // Ensure contextValue is available after render
    if (!contextValue) {
      throw new Error('AppContext value not found after render. Ensure AppProvider wraps TestConsumer.');
    }
  });

  it('should add a WeChat platform account with appId and appSecret', () => {
    if (!contextValue) {
      throw new Error('AppContext value not available in test.');
    }

    const weChatData: Partial<PlatformAccount> = {
      platformName: 'My WeChat OA',
      username: 'wechat_user_123',
      appId: 'wx12345appid',
      appSecret: 'secret12345appsecret',
    };

    act(() => {
      contextValue!.addPlatformAccount(weChatData);
    });

    const updatedAccounts = contextValue!.platformAccounts;
    const newAccount = updatedAccounts.find(acc => acc.platformName === 'My WeChat OA');

    expect(newAccount).toBeDefined();
    expect(newAccount?.username).toBe('wechat_user_123');
    expect(newAccount?.appId).toBe('wx12345appid');
    expect(newAccount?.appSecret).toBe('secret12345appsecret');
    expect(newAccount?.isConnected).toBe(false); // Default value
  });

  it('should add a generic platform account without appId and appSecret', () => {
    if (!contextValue) {
      throw new Error('AppContext value not available in test.');
    }

    // Ensure the state is clean from the previous test if AppProvider is not re-rendered fresh.
    // Our beforeEach handles this, but as a safeguard for understanding:
    // If platformAccounts were to persist across tests without beforeEach re-rendering,
    // we might need to clear them manually.
    // For example: contextValue.platformAccounts.length = 0; (direct mutation, not always good)
    // or setPlatformAccounts([]) if available.

    const genericData: Partial<PlatformAccount> = {
      platformName: 'My Blog',
      username: 'blog_user',
    };

    act(() => {
      contextValue!.addPlatformAccount(genericData);
    });

    const updatedAccounts = contextValue!.platformAccounts;
    // Need to be careful if 'My WeChat OA' is still there from a previous test
    // The beforeEach should prevent this by re-rendering and clearing localStorage
    const newAccount = updatedAccounts.find(acc => acc.platformName === 'My Blog');

    expect(newAccount).toBeDefined();
    expect(newAccount?.username).toBe('blog_user');
    expect(newAccount?.appId).toBeUndefined();
    expect(newAccount?.appSecret).toBeUndefined();
    expect(newAccount?.isConnected).toBe(false); // Default value
  });
});
