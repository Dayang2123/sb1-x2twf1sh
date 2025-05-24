import { 
  saveAIConfig, loadAIConfig, 
  saveNewsConfig, loadNewsConfig, 
  AIConfig, NewsConfig 
} from './configService';

describe('ConfigService', () => {
  let getItemSpy: jest.SpyInstance;
  let setItemSpy: jest.SpyInstance;

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear(); // Clear localStorage after each test
  });

  // AIConfig Tests
  describe('AIConfig', () => {
    const mockAIConfig: AIConfig = {
      apiKey: 'test-ai-api-key',
      apiUrl: 'https://api.example.com/ai',
      model: 'gpt-test',
    };
    const AI_CONFIG_KEY = 'appSettings.aiConfig';

    it('should save AIConfig to localStorage', () => {
      saveAIConfig(mockAIConfig);
      expect(setItemSpy).toHaveBeenCalledWith(AI_CONFIG_KEY, JSON.stringify(mockAIConfig));
    });

    it('should load AIConfig from localStorage if set', () => {
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(mockAIConfig)); // Pre-populate
      getItemSpy.mockReturnValueOnce(JSON.stringify(mockAIConfig)); // Mock return value

      const loadedConfig = loadAIConfig();
      expect(getItemSpy).toHaveBeenCalledWith(AI_CONFIG_KEY);
      expect(loadedConfig).toEqual(mockAIConfig);
    });

    it('should return null if AIConfig is not set in localStorage', () => {
      getItemSpy.mockReturnValueOnce(null);
      const loadedConfig = loadAIConfig();
      expect(getItemSpy).toHaveBeenCalledWith(AI_CONFIG_KEY);
      expect(loadedConfig).toBeNull();
    });

    it('should return null if AIConfig in localStorage is invalid JSON', () => {
      localStorage.setItem(AI_CONFIG_KEY, 'invalid-json');
      getItemSpy.mockReturnValueOnce('invalid-json');
      
      // Suppress console.error for this specific test case
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const loadedConfig = loadAIConfig();
      expect(loadedConfig).toBeNull();
      consoleErrorSpy.mockRestore();
    });
  });

  // NewsConfig Tests
  describe('NewsConfig', () => {
    const mockNewsConfig: NewsConfig = {
      apiKey: 'test-news-api-key',
    };
    const NEWS_CONFIG_KEY = 'appSettings.newsConfig';

    it('should save NewsConfig to localStorage', () => {
      saveNewsConfig(mockNewsConfig);
      expect(setItemSpy).toHaveBeenCalledWith(NEWS_CONFIG_KEY, JSON.stringify(mockNewsConfig));
    });

    it('should load NewsConfig from localStorage if set', () => {
      localStorage.setItem(NEWS_CONFIG_KEY, JSON.stringify(mockNewsConfig));
      getItemSpy.mockReturnValueOnce(JSON.stringify(mockNewsConfig));

      const loadedConfig = loadNewsConfig();
      expect(getItemSpy).toHaveBeenCalledWith(NEWS_CONFIG_KEY);
      expect(loadedConfig).toEqual(mockNewsConfig);
    });

    it('should return null if NewsConfig is not set in localStorage', () => {
      getItemSpy.mockReturnValueOnce(null);
      const loadedConfig = loadNewsConfig();
      expect(getItemSpy).toHaveBeenCalledWith(NEWS_CONFIG_KEY);
      expect(loadedConfig).toBeNull();
    });
    
    it('should return null if NewsConfig in localStorage is invalid JSON', () => {
      localStorage.setItem(NEWS_CONFIG_KEY, 'invalid-json-news');
      getItemSpy.mockReturnValueOnce('invalid-json-news');

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const loadedConfig = loadNewsConfig();
      expect(loadedConfig).toBeNull();
      consoleErrorSpy.mockRestore();
    });
  });

  // Test localStorage error handling during save (optional, but good practice)
  describe('localStorage error handling on save', () => {
    const mockAIConfig: AIConfig = { apiKey: 'any', apiUrl: 'any', model: 'any' };
    const AI_CONFIG_KEY = 'appSettings.aiConfig';

    it('should console.error when saving AIConfig fails', () => {
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage full');
      });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      saveAIConfig(mockAIConfig);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Error saving AI config to localStorage:');
      consoleErrorSpy.mockRestore();
    });

    const mockNewsConfig: NewsConfig = { apiKey: 'anynews' };
    const NEWS_CONFIG_KEY = 'appSettings.newsConfig';

    it('should console.error when saving NewsConfig fails', () => {
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage full');
      });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      saveNewsConfig(mockNewsConfig);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Error saving News config to localStorage:');
      consoleErrorSpy.mockRestore();
    });
  });
});
