import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchNews, NewsArticle } from '../services/newsService';

const NewsFeed: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // The newsService will now load the API key from localStorage.
        // Default query is "technology".
        const fetchedArticles = await fetchNews("technology");
        setArticles(fetchedArticles);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching news.");
        }
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '2em', margin: 0 }}>News Feed</h1>
      </header>

      {loading && <p>Loading news...</p>}
      
      {error && <p style={{ color: 'red' }}>Error fetching news: {error}</p>}

      {!loading && !error && articles.length === 0 && <p>No news articles found.</p>}

      {!loading && !error && articles.length > 0 && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {articles.map((article, index) => (
            <li key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <h2 style={{ fontSize: '1.5em', margin: '0 0 10px 0' }}>
                <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff' }}>
                  {article.title}
                </a>
              </h2>
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title} 
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', marginBottom: '10px', borderRadius: '4px' }} 
                />
              )}
              <p style={{ margin: '0 0 10px 0', color: '#555' }}>{article.description}</p>
              <small style={{ color: '#777' }}>
                Source: {article.source.name} - Published: {new Date(article.publishedAt).toLocaleDateString()}
              </small>
              <button 
                onClick={() => navigate('/editor', { state: { newsArticle: article } })}
                style={{ 
                  display: 'block', 
                  marginTop: '10px', 
                  padding: '8px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Use as context for AI
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsFeed;
