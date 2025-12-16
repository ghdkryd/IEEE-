import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from '../types';

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// We assume it is pre-configured and accessible.

const SYSTEM_INSTRUCTION = `
You are a presentation expert. Your job is to take raw text or a topic and convert it into a structural JSON for a slide deck.
The design style is Neo-Brutalism, so the copy should be punchy, direct, and bold.
`;

export const generateSlides = async (input: string): Promise<Slide[]> => {
  if (!process.env.API_KEY) {
    return [{
      title: "Configuration Error",
      content: "API Key is missing.",
      bulletPoints: ["Set process.env.API_KEY in your environment variables."],
      layout: "title"
    }];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a 5-slide presentation for this content: "${input}". Ensure the first slide is a Title slide.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  bulletPoints: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  layout: { 
                    type: Type.STRING, 
                    enum: ["title", "bullet", "split", "quote"] 
                  },
                  imagePrompt: { type: Type.STRING }
                },
                required: ["title", "content", "bulletPoints", "layout"]
              }
            }
          },
          required: ["slides"]
        }
      }
    });

    const text = response.text;
    
    if (text) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          return parsed.slides;
        }
      } catch (e) {
        console.error("Failed to parse JSON", e);
      }
    }
    throw new Error("Invalid content generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      {
        title: "Connection Error",
        content: "Failed to reach the AI service.",
        bulletPoints: ["Check API Key", "Verify Network", "Try again"],
        layout: "title"
      }
    ];
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!process.env.API_KEY) return "Error: API Key missing.";
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: "You are NeoDeck's helpful assistant. Keep answers short and punchy."
      }
    });
    return response.text || "Processing...";
  } catch (error) {
    console.error(error);
    return "Offline mode.";
  }
};