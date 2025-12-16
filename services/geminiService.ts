import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSlides = async (input: string, mode: 'strict' | 'creative', slideCount: number): Promise<Slide[]> => {
  
  const SYSTEM_INSTRUCTION = `
You are an expert Presentation Designer.

**CRITICAL RULE: LANGUAGE CONSISTENCY**
- Detect the language of the user's input.
- If the input is in **Arabic**, ALL generated content (title, content, bulletPoints) MUST be in **Arabic**.
- If the input is in **English**, use **English**.

**Output Structure:**
Output a JSON object with a "slides" array.
Each slide must have:
- title (string): Short, impactful title.
- content (string): Concise body text, max 30 words.
- bulletPoints (string array): 3-5 short points.
- layout (enum): "title", "bullet", "split", "quote", "focus".

**Modes:**
- STRICT: Stick exactly to the user's provided text.
- CREATIVE: Expand and add value, making the presentation engaging.
`;

  try {
    const prompt = `Create a ${slideCount}-slide presentation.
    Topic: "${input}". 
    Mode: ${mode.toUpperCase()}.
    
    Structure:
    1. Title Slide
    2. Body Slides (varied layouts to keep it interesting)
    ${slideCount}. Conclusion
    
    Make sure the text is concise and fits on a slide. Focus on strong typography.`;

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
                    description: 'One of: "title", "bullet", "split", "quote", "focus"'
                  }
                },
                required: ["title", "content", "bulletPoints", "layout"]
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
        title: "Error / خطأ",
        content: "Could not generate content. Please try again. / تعذر إنشاء المحتوى.",
        bulletPoints: ["Check API Key", "Check Connection"],
        layout: "title"
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
        systemInstruction: "You are NeoDeck's helpful assistant. If the user asks in Arabic, reply in Arabic. Keep answers short."
      }
    });
    return response.text || "Processing...";
  } catch (error) {
    console.error(error);
    return "Service unavailable.";
  }
};