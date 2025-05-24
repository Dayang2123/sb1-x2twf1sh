export interface AIConfig {
  model: string;
  apiKey: string;
  apiUrl?: string;
}

export const generateContentFromAI = async (
  prompt: string,
  contextContent: string, // contextContent can be used to enrich the prompt
  config: AIConfig
): Promise<string> => {
  console.log('AI Service: Generating content with prompt:', { prompt, contextContent, model: config.model, apiUrl: config.apiUrl });

  if (!config.apiUrl) {
    console.error("AI Service Error: API URL is not configured.");
    throw new Error("AI API URL is not configured. Please check your settings.");
  }

  const requestBody = {
    model: config.model,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      // You could potentially add contextContent to the user prompt or as a separate message
      { role: "user", content: `${prompt}${contextContent ? `\n\nContext:\n${contextContent}` : ''}` }
    ],
    // Add other parameters like temperature or max_tokens if needed, e.g.:
    // temperature: 0.7,
    // max_tokens: 150,
  };

  console.log('AI Service: Sending request to', config.apiUrl, 'with body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('AI Service: Received response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text(); // Try to get more error info
      console.error('AI Service Error: API request failed with status', response.status, 'and body:', errorBody);
      throw new Error(`AI API request failed: ${response.status} ${response.statusText}. Details: ${errorBody}`);
    }

    const responseData = await response.json();
    console.log('AI Service: Received data:', JSON.stringify(responseData, null, 2));

    // Adjust this path based on the actual API response structure
    // Common paths: choices[0].message.content, data.text, result.text, etc.
    const content = responseData?.choices?.[0]?.message?.content;

    if (!content) {
      console.error('AI Service Error: Could not extract content from AI response. Response structure might be unexpected.', responseData);
      throw new Error('Failed to extract content from AI response. Check service logs for response structure.');
    }

    console.log("AI Service: Successfully generated content.");
    return content;

  } catch (error) {
    console.error('AI Service Error: An error occurred during the AI request:', error);
    if (error instanceof Error) {
      throw error; // Re-throw if it's already an Error object
    }
    throw new Error(`An unexpected error occurred while contacting the AI service: ${String(error)}`);
  }
};

export const generateImagesFromAI = async (
  prompt: string,
  config: AIConfig // Included for future use, not used in mock
): Promise<string[]> => {
  console.log('AI Image Service called with:', { prompt, config });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (prompt.toLowerCase().includes("failimage")) {
        console.error("AI Image Service: Simulating error for prompt:", prompt);
        reject("Simulated AI image generation error: The prompt contained 'failimage'.");
      } else {
        const imageCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 images
        const imageUrls: string[] = [];
        for (let i = 0; i < imageCount; i++) {
          const seed = `${prompt.replace(/\s+/g, '-')}-${i}-${Date.now()}`;
          imageUrls.push(`https://picsum.photos/seed/${seed}/300/200`);
        }
        console.log("AI Image Service: Simulating success for prompt:", prompt, "Generated URLs:", imageUrls);
        resolve(imageUrls);
      }
    }, 2000); // Simulate 2 second delay
  });
};
