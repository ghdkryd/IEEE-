import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a presentation expert. Your job is to take raw text or a topic and convert it into a structural JSON for a slide deck.

You must output a valid JSON object with a single key "slides" containing an array of slide objects.
Each slide object must have:
- title (string): Short punchy title.
- content (string): The main body text.
- bulletPoints (array of strings): 2-4 key takeaways.
- layout (one of: "title", "bullet", "split", "quote", "image-center").
- imagePrompt (string): A descriptive English prompt to generate an AI image for this slide. It should describe a visual scene, style, or object related to the content. Do not use text in the image prompt.

Modes:
- STRICT: Stick exactly to the user's provided text. Do not add external facts or fluff. Summarize what is there.
- CREATIVE: You are the expert. Expand on the user's ideas, infer logical consequences, add engaging examples, and make the content richer than the input.
`;

export const generateSlides = async (input: string, mode: 'strict' | 'creative'): Promise<Slide[]> => {
  try {
    const prompt = `Create a 6-slide presentation for this content: "${input}". 
    Mode: ${mode.toUpperCase()}.
    Ensure the first slide is a Title slide. 
    Make the design and flow logical.`;

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
    // Return the actual error message to help debug
    return [
      {
        title: "Error Occurred",
        content: error?.message || "Failed to reach the AI service.",
        bulletPoints: ["Check Console for details", "Verify API Key", "Try again"],
        layout: "title",
        imagePrompt: "error warning sign glitch style red"
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
    return "Offline mode (Check API Key).";
  }
};