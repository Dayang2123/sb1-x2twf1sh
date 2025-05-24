export interface NewsArticle {
  title: string;
  description: string;
  url: string; // URL to the original article
  source: { name: string };
  publishedAt: string;
  image?: string; // Optional image URL
  content?: string; // Full content if available, often truncated in free APIs
}

import { loadNewsConfig } from './configService'; // Import loadNewsConfig

export const fetchNews = async (query: string = 'latest'): Promise<NewsArticle[]> => {
  const newsConfig = loadNewsConfig();
  const apiKeyFromConfig = newsConfig?.apiKey;

  if (!apiKeyFromConfig || apiKeyFromConfig === "YOUR_GNEWS_API_KEY" || apiKeyFromConfig.trim() === "") {
    console.warn("NewsService: API key is missing, a placeholder, or empty. Returning mock data. Please configure in Settings.");
    // Return mock data if no valid API key is provided
    return [
      {
        title: "Mock Article 1: The Future of AI",
        description: "A deep dive into the advancements and implications of artificial intelligence.",
        url: "#",
        source: { name: "Mock News" },
        publishedAt: new Date().toISOString(),
        image: "https://via.placeholder.com/300x200?text=AI+Future",
        content: "This is some mock content about the future of AI..."
      },
      {
        title: "Mock Article 2: Global Economic Trends",
        description: "An overview of the current global economic trends and predictions for the next quarter.",
        url: "#",
        source: { name: "Mock Business Today" },
        publishedAt: new Date().toISOString(),
        image: "https://via.placeholder.com/300x200?text=Economy",
        content: "This is some mock content about global economic trends..."
      }
    ];
  }

  const category = "general"; // Or make it a parameter
  const lang = "en";
  const country = "us";
  const max = 10; // Number of articles to fetch
  const apiUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${lang}&country=${country}&max=${max}&apikey=${apiKeyFromConfig}&q=${encodeURIComponent(query)}`;

  console.log(`NewsService: Fetching news with query "${query}". API key presence: ${!!apiKeyFromConfig}`);

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('NewsService: API request failed with status', response.status, 'Response:', errorData);
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
    }

    const data = await response.json();

    if (!data.articles) {
      console.error('NewsService: "articles" array not found in response', data);
      throw new Error('Failed to parse news articles from API response.');
    }

    // Map the fetched articles to the NewsArticle interface
    const articles: NewsArticle[] = data.articles.map((apiArticle: any) => ({
      title: apiArticle.title,
      description: apiArticle.description,
      url: apiArticle.url,
      source: { name: apiArticle.source.name },
      publishedAt: apiArticle.publishedAt,
      image: apiArticle.image, // Optional
      content: apiArticle.content, // Optional
    }));

    console.log('NewsService: Successfully fetched and mapped articles:', articles.length);
    return articles;

  } catch (error) {
    console.error('NewsService: An error occurred during news fetching:', error);
    if (error instanceof Error) {
      throw error; // Re-throw if it's already an Error object
    }
    throw new Error(`An unexpected error occurred while fetching news: ${String(error)}`);
  }
};
