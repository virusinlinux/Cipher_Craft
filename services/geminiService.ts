
import { GoogleGenAI } from "@google/genai";

export const generateStory = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please set the API_KEY environment variable.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, mysterious story (about 100 words) based on this prompt: "${prompt}". The story should be suitable for encryption.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    if (error instanceof Error) {
        return `Error from Gemini: ${error.message}`;
    }
    return "An unknown error occurred while generating the story.";
  }
};
