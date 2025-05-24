import { generateContentFromAI, AIConfig } from './aiService';

// Mock the global fetch function
global.fetch = jest.fn();

describe('AIService - generateContentFromAI', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  const mockPrompt = 'Test prompt';
  const mockContextContent = 'Test context';

  const validConfig: AIConfig = {
    apiKey: 'test-ai-key',
    apiUrl: 'https://api.example.com/ai/chat',
    model: 'test-model-gpt',
  };

  const mockAISuccessResponse = {
    choices: [
      {
        message: {
          role: 'assistant',
          content: 'Successfully generated AI content.',
        },
      },
    ],
  };

  it('should call AI API with correct parameters and return content on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAISuccessResponse,
    });

    const content = await generateContentFromAI(mockPrompt, mockContextContent, validConfig);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(validConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${validConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: validConfig.model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `${mockPrompt}\n\nContext:\n${mockContextContent}` },
        ],
      }),
    });
    expect(content).toBe(mockAISuccessResponse.choices[0].message.content);
  });
  
  it('should handle prompt without contextContent', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAISuccessResponse,
    });

    await generateContentFromAI(mockPrompt, '', validConfig); // Empty contextContent

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(validConfig.apiUrl, 
      expect.objectContaining({
        body: JSON.stringify({
          model: validConfig.model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: `${mockPrompt}` }, // Context part should be absent
          ],
        }),
      })
    );
  });


  it('should throw an error if apiUrl is missing in AIConfig', async () => {
    const configWithoutApiUrl: AIConfig = { ...validConfig, apiUrl: '' };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      generateContentFromAI(mockPrompt, mockContextContent, configWithoutApiUrl)
    ).rejects.toThrow('AI API URL is not configured. Please check your settings.');
    
    expect(fetch).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should throw an error if API request fails (response not ok)', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Invalid API Key', // Changed from .json() to .text() based on service code
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      generateContentFromAI(mockPrompt, mockContextContent, validConfig)
    ).rejects.toThrow('AI API request failed: 401 Unauthorized. Details: Invalid API Key');
    
    expect(fetch).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });

  it('should throw an error if content cannot be extracted from AI response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ some: 'unexpected structure' }), // No choices[0].message.content
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      generateContentFromAI(mockPrompt, mockContextContent, validConfig)
    ).rejects.toThrow('Failed to extract content from AI response. Check service logs for response structure.');
    
    expect(fetch).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });
  
  it('should throw an error if choices array is empty', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [] }), 
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      generateContentFromAI(mockPrompt, mockContextContent, validConfig)
    ).rejects.toThrow('Failed to extract content from AI response.');
    consoleErrorSpy.mockRestore();
  });

  it('should throw an error if message is missing in choice', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{}] }),
    });
     const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      generateContentFromAI(mockPrompt, mockContextContent, validConfig)
    ).rejects.toThrow('Failed to extract content from AI response.');
    consoleErrorSpy.mockRestore();
  });
  
  it('should throw an error if content is missing in message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: {} }] }),
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      generateContentFromAI(mockPrompt, mockContextContent, validConfig)
    ).rejects.toThrow('Failed to extract content from AI response.');
    consoleErrorSpy.mockRestore();
  });

  it('should throw a generic error for unexpected issues during fetch', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network connection failed'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(generateContentFromAI(mockPrompt, mockContextContent, validConfig)).rejects.toThrow(
        'An unexpected error occurred while contacting the AI service: Error: Network connection failed'
    );
    consoleErrorSpy.mockRestore();
  });
});
