export interface AIConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
}

export interface NewsConfig {
  apiKey: string;
  // query?: string; // Optional: for default news query - keeping it commented as per instructions
}

const AI_CONFIG_KEY = 'appSettings.aiConfig';
const NEWS_CONFIG_KEY = 'appSettings.newsConfig';

// AI Configuration
export const saveAIConfig = (config: AIConfig): void => {
  try {
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving AI config to localStorage:", error);
  }
};

export const loadAIConfig = (): AIConfig | null => {
  try {
    const storedConfig = localStorage.getItem(AI_CONFIG_KEY);
    if (storedConfig) {
      return JSON.parse(storedConfig) as AIConfig;
    }
    return null;
  } catch (error) {
    console.error("Error loading AI config from localStorage:", error);
    return null;
  }
};

// News Configuration
export const saveNewsConfig = (config: NewsConfig): void => {
  try {
    localStorage.setItem(NEWS_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving News config to localStorage:", error);
  }
};

export const loadNewsConfig = (): NewsConfig | null => {
  try {
    const storedConfig = localStorage.getItem(NEWS_CONFIG_KEY);
    if (storedConfig) {
      return JSON.parse(storedConfig) as NewsConfig;
    }
    return null;
  } catch (error) {
    console.error("Error loading News config from localStorage:", error);
    return null;
  }
};
