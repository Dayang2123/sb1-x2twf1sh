export interface AIConfigEntry {
  id: string;
  name: string;
  apiKey: string;
  apiUrl: string;
  model: string;
}

export interface NewsConfig {
  apiKey: string;
  // query?: string; // Optional: for default news query - keeping it commented as per instructions
}

const AI_CONFIGS_KEY = 'appSettings.aiConfigs'; // Changed from AI_CONFIG_KEY
const ACTIVE_AI_CONFIG_ID_KEY = 'appSettings.activeAiConfigId';
const NEWS_CONFIG_KEY = 'appSettings.newsConfig';

// AI Configuration
export const loadAllAIConfigs = (): AIConfigEntry[] => {
  try {
    const storedConfigs = localStorage.getItem(AI_CONFIGS_KEY);
    if (storedConfigs) {
      return JSON.parse(storedConfigs) as AIConfigEntry[];
    }
    return [];
  } catch (error) {
    console.error("Error loading AI configs from localStorage:", error);
    return [];
  }
};

export const saveAIConfigs = (configs: AIConfigEntry[]): void => {
  try {
    localStorage.setItem(AI_CONFIGS_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error("Error saving AI configs to localStorage:", error);
  }
};

export const addAIConfig = (newConfig: Omit<AIConfigEntry, 'id'>): AIConfigEntry => {
  const id = crypto.randomUUID();
  const configToAdd: AIConfigEntry = { ...newConfig, id };
  try {
    const configs = loadAllAIConfigs();
    configs.push(configToAdd);
    saveAIConfigs(configs);
  } catch (error) {
    console.error("Error adding AI config:", error);
    // Optionally re-throw or handle more gracefully depending on requirements
  }
  return configToAdd;
};

export const updateAIConfig = (updatedConfig: AIConfigEntry): void => {
  try {
    let configs = loadAllAIConfigs();
    configs = configs.map(config => config.id === updatedConfig.id ? updatedConfig : config);
    saveAIConfigs(configs);
  } catch (error) {
    console.error("Error updating AI config:", error);
  }
};

export const deleteAIConfig = (configId: string): void => {
  try {
    let configs = loadAllAIConfigs();
    configs = configs.filter(config => config.id !== configId);
    saveAIConfigs(configs);

    const activeId = getActiveAIConfigId();
    if (activeId === configId) {
      setActiveAIConfigId(null);
    }
  } catch (error) {
    console.error("Error deleting AI config:", error);
  }
};

export const setActiveAIConfigId = (configId: string | null): void => {
  try {
    if (configId === null) {
      localStorage.removeItem(ACTIVE_AI_CONFIG_ID_KEY);
    } else {
      localStorage.setItem(ACTIVE_AI_CONFIG_ID_KEY, configId);
    }
  } catch (error) {
    console.error("Error setting active AI config ID in localStorage:", error);
  }
};

export const getActiveAIConfigId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_AI_CONFIG_ID_KEY);
  } catch (error) {
    console.error("Error loading active AI config ID from localStorage:", error);
    return null;
  }
};

export const loadActiveAIConfig = (): AIConfigEntry | null => {
  try {
    const activeId = getActiveAIConfigId();
    if (!activeId) {
      return null;
    }
    const configs = loadAllAIConfigs();
    return configs.find(config => config.id === activeId) || null;
  } catch (error) {
    console.error("Error loading active AI config:", error);
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
