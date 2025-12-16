import { GoogleGenAI, Type } from "@google/genai";
import Groq from "groq-sdk";
import { Slide } from '../types';

// --- CRITICAL FIX: HARDCODED API KEY ---
// To prevent "Black Screen" caused by environment variable issues in Vite/Browser.
const API_KEY = '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';

const isGroq = API_KEY.startsWith('gsk_');

// Initialize clients
let googleAi: GoogleGenAI | null = null;
let groq: Groq | null = null;

try {
  if (API_KEY) {
    if (isGroq) {
      // dangerouslyAllowBrowser is required for running Groq SDK in browser environment
      // This prevents the "refused to run in browser" error
      groq = new Groq({ 
        apiKey: API_KEY, 
        dangerouslyAllowBrowser: true 
      });
    } else {
      googleAi = new GoogleGenAI({ apiKey: API_KEY });
    }
  }
} catch (error) {
  console.error("Client Initialization Error:", error);
}

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

    // --- GROQ PATH ---
    if (isGroq && groq) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION + "\n\nIMPORTANT: Return ONLY valid JSON." },
          { role: "user", content: prompt + "\n\nOutput JSON object with format: { \"slides\": [{ \"title\": \"...\", \"content\": \"...\", \"bulletPoints\": [\"...\"], \"layout\": \"...\" }] }" }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return (parsed.slides || []) as Slide[];
      }
    } 
    // --- GOOGLE PATH ---
    else if (googleAi) {
      const response = await googleAi.models.generateContent({
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
         const parsed = JSON.parse(content);
         return (parsed.slides || []) as Slide[];
      }
    }
    
    throw new Error("No active AI client or empty response");

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return [
      {
        title: "Error / خطأ",
        content: "Could not generate content. Please try again. / تعذر إنشاء المحتوى.",
        bulletPoints: ["Check API Key", "Check Connection", error.message || "Unknown error"],
        layout: "title"
      }
    ] as Slide[];
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    const systemMsg = "You are NeoDeck's helpful assistant. If the user asks in Arabic, reply in Arabic. Keep answers short.";
    
    if (isGroq && groq) {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: userMessage }
        ],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0]?.message?.content || "Processing...";
    } else if (googleAi) {
      const response = await googleAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMessage,
        config: {
          systemInstruction: systemMsg
        }
      });
      return response.text || "Processing...";
    }
    return "Service unavailable.";
  } catch (error) {
    console.error(error);
    return "Service unavailable.";
  }
};