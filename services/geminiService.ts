import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a presentation expert. Your job is to take raw text or a topic and convert it into a structural JSON for a slide deck.
The design style is Neo-Brutalism, so the copy should be punchy, direct, and bold.
`;

export const generateSlides = async (input: string): Promise<Slide[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a 5-slide presentation based on the following content: "${input}". 
      Ensure the first slide is a Title slide. 
      Make the content engaging and concise.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
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
              }
            },
            required: ["title", "content", "bulletPoints", "layout"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Slide[];
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a fallback slide deck in case of error
    return [
      {
        title: "Error Generating Deck",
        content: "We encountered an issue connecting to the AI brain.",
        bulletPoints: ["Check your connection", "Try a shorter prompt", "Try again later"],
        layout: "title"
      }
    ];
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: "You are NeoDeck's helpful assistant. Help users formatting their text for presentations.",
      }
    });
    return response.text || "I'm thinking...";
  } catch (error) {
    console.error(error);
    return "Offline mode.";
  }
};