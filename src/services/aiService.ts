export interface AIConfig {
  model: string;
  apiKey: string;
  apiUrl?: string;
}

export const generateContentFromAI = async (
  prompt: string,
  contextContent: string, // Included for future use, not used in mock
  config: AIConfig // Included for future use, not used in mock
): Promise<string> => {
  console.log('AI Service called with:', { prompt, contextContent, config });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (prompt.toLowerCase().includes("error")) {
        console.error("AI Service: Simulating error for prompt:", prompt);
        reject("Simulated AI error: The prompt contained 'error'.");
      } else {
        const aiResponse = `AI Generated: "${prompt}" based on context (length: ${contextContent.length}). Using model ${config.model}.`;
        console.log("AI Service: Simulating success for prompt:", prompt);
        resolve(aiResponse);
      }
    }, 1500); // Simulate 1.5 second delay
  });
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
