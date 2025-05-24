import { fetchNews, NewsArticle } from './newsService';
import * as ConfigService from './configService'; // Import all exports to mock loadNewsConfig

// Mock the global fetch function
global.fetch = jest.fn();

describe('NewsService - fetchNews', () => {
  let loadNewsConfigSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    loadNewsConfigSpy = jest.spyOn(ConfigService, 'loadNewsConfig');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockApiResponseArticles = [
    {
      title: 'Fetched Article 1',
      description: 'Description for fetched article 1',
      url: 'https://example.com/fetched1',
      source: { name: 'Fetched News Source' },
      publishedAt: new Date().toISOString(),
      image: 'https://example.com/image1.jpg',
      content: 'Full content for article 1',
    },
    {
      title: 'Fetched Article 2',
      description: 'Description for fetched article 2',
      url: 'https://example.com/fetched2',
      source: { name: 'Fetched News Source' },
      publishedAt: new Date().toISOString(),
      image: 'https://example.com/image2.jpg',
      content: 'Full content for article 2',
    },
  ];

  const mockGNewsResponse = {
    totalArticles: 2,
    articles: mockApiResponseArticles,
  };

  const mockLocalArticles: NewsArticle[] = [
      {
        title: "Mock Article 1: The Future of AI",
        description: "A deep dive into the advancements and implications of artificial intelligence.",
        url: "#",
        source: { name: "Mock News" },
        publishedAt: expect.any(String), // Date will vary
        image: "https://via.placeholder.com/300x200?text=AI+Future",
        content: "This is some mock content about the future of AI..."
      },
      {
        title: "Mock Article 2: Global Economic Trends",
        description: "An overview of the current global economic trends and predictions for the next quarter.",
        url: "#",
        source: { name: "Mock Business Today" },
        publishedAt: expect.any(String), // Date will vary
        image: "https://via.placeholder.com/300x200?text=Economy",
        content: "This is some mock content about global economic trends..."
      }
  ];


  it('should fetch news from GNews API when a valid API key is configured', async () => {
    loadNewsConfigSpy.mockReturnValue({ apiKey: 'test-valid-key' });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGNewsResponse,
    });

    const query = 'technology';
    const articles = await fetchNews(query);

    expect(loadNewsConfigSpy).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`apikey=test-valid-key`)
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`q=${encodeURIComponent(query)}`)
    );
    expect(articles).toEqual(mockApiResponseArticles);
  });

  it('should return mock data if API key is not configured', async () => {
    loadNewsConfigSpy.mockReturnValue(null); // No API key
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress console.warn

    const articles = await fetchNews('anyquery');

    expect(loadNewsConfigSpy).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe(mockLocalArticles[0].title);
    expect(articles[1].title).toBe(mockLocalArticles[1].title);
    
    // Check if publishedAt is a valid date string for mock articles
    articles.forEach(article => {
        expect(new Date(article.publishedAt).toString()).not.toBe("Invalid Date");
    });
    consoleWarnSpy.mockRestore();
  });

  it('should return mock data if API key is a placeholder', async () => {
    loadNewsConfigSpy.mockReturnValue({ apiKey: 'YOUR_GNEWS_API_KEY' });
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const articles = await fetchNews('anyquery');
    
    expect(loadNewsConfigSpy).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe(mockLocalArticles[0].title);
    consoleWarnSpy.mockRestore();
  });

  it('should return mock data if API key is an empty string', async () => {
    loadNewsConfigSpy.mockReturnValue({ apiKey: '' });
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const articles = await fetchNews('anyquery');
    
    expect(loadNewsConfigSpy).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe(mockLocalArticles[0].title);
    consoleWarnSpy.mockRestore();
  });

  it('should throw an error if the API request fails (response not ok)', async () => {
    loadNewsConfigSpy.mockReturnValue({ apiKey: 'test-valid-key' });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error details' }),
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});


    await expect(fetchNews('technology')).rejects.toThrow(
      'Failed to fetch news: 500 Internal Server Error. Server error details'
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });
  
  it('should throw an error if the API response is ok but data.articles is missing', async () => {
    loadNewsConfigSpy.mockReturnValue({ apiKey: 'test-valid-key' });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ totalArticles: 0 }), // Missing 'articles' array
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(fetchNews('technology')).rejects.toThrow(
      'Failed to parse news articles from API response.'
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });

  it('should throw a generic error for unexpected issues during fetch', async () => {
    loadNewsConfigSpy.mockReturnValue({ apiKey: 'test-valid-key' });
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network connection failed'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(fetchNews('technology')).rejects.toThrow(
        'An unexpected error occurred while fetching news: Error: Network connection failed'
    );
    consoleErrorSpy.mockRestore();
  });

});
