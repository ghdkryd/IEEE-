import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a top-tier Presentation Designer. Your goal is to create structured content for slide decks.

Output a JSON object with a "slides" array.
Each slide must have:
- title (string): Short, impactful title.
- content (string): Concise body text (max 2 sentences).
- bulletPoints (string array): 3-5 short, punchy points.
- layout (enum): "title", "bullet", "split", "quote", "image-center".
- imagePrompt (string): A detailed visual description for an AI image generator. Describe the scene, lighting, mood, and objects. NO TEXT in the image prompt.

Modes:
- STRICT: Summarize the user's input exactly.
- CREATIVE: Expand, explain, and add value to the content.
`;

export const generateSlides = async (input: string, mode: 'strict' | 'creative', slideCount: number): Promise<Slide[]> => {
  try {
    const prompt = `Create a ${slideCount}-slide presentation.
    Topic/Content: "${input}". 
    Mode: ${mode.toUpperCase()}.
    
    Structure:
    1. Title Slide
    2. Introduction
    ... (body slides)
    ${slideCount}. Conclusion/Call to Action
    
    Ensure variety in layouts.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
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
                    description: 'One of: "title", "bullet", "split", "quote", "image-center"'
                  },
                  imagePrompt: { type: Type.STRING }
                },
                required: ["title", "content", "bulletPoints", "layout", "imagePrompt"]
              }
            }
          },
          required: ["slides"]
        }
      }
    });

    const content = response.text;
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.slides && Array.isArray(parsed.slides)) {
          return parsed.slides as Slide[];
        }
      } catch (e) {
        console.error("Failed to parse JSON", e);
      }
    }
    throw new Error("Invalid content generated");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return [
      {
        title: "Error Occurred",
        content: error?.message || "Failed to reach the AI service.",
        bulletPoints: ["Check connection", "Verify API Key", "Try again"],
        layout: "title",
        imagePrompt: "glitch art error warning red"
      }
    ] as Slide[];
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
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