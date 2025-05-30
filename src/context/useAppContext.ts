import { useContext } from 'react';
import { AppContext, AppContextType } from './AppContext'; // AppContext needs to be exported from AppContext.tsx

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
