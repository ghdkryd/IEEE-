import Groq from "groq-sdk";
import { Slide } from '../types';

// Initialize Groq with browser permission enabled
// This fixes the "Black Screen" issue when running client-side
const groq = new Groq({ 
  apiKey: process.env.API_KEY, 
  dangerouslyAllowBrowser: true 
});

const SYSTEM_INSTRUCTION = `
You are a presentation expert. Your job is to take raw text or a topic and convert it into a structural JSON for a slide deck.
The design style is Neo-Brutalism, so the copy should be punchy, direct, and bold.

You must output a valid JSON object with a single key "slides" containing an array of slide objects.
Each slide object must have:
- title (string)
- content (string)
- bulletPoints (array of strings)
- layout (one of: "title", "bullet", "split", "quote")

Example JSON:
{
  "slides": [
    {
      "title": "NEO DESIGN",
      "content": "Bold shadows and high contrast.",
      "bulletPoints": ["Stark borders", "Vibrant colors"],
      "layout": "split"
    }
  ]
}
`;

export const generateSlides = async (input: string): Promise<Slide[]> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { 
          role: "user", 
          content: `Create a 5-slide presentation for this content: "${input}". Ensure the first slide is a Title slide.` 
        }
      ],
      model: "llama3-70b-8192",
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        // Handle both direct array or wrapped object
        if (parsed.slides && Array.isArray(parsed.slides)) {
          return parsed.slides;
        } else if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse JSON", e);
      }
    }
    throw new Error("Invalid content generated");
  } catch (error) {
    console.error("Groq API Error:", error);
    return [
      {
        title: "Connection Error",
        content: "Failed to reach the Groq Cloud.",
        bulletPoints: ["Check API Key", "Verify Network", "Try again"],
        layout: "title"
      }
    ];
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are NeoDeck's helpful assistant. Keep answers short and punchy." },
        { role: "user", content: userMessage }
      ],
      model: "llama3-70b-8192"
    });
    return completion.choices[0]?.message?.content || "Processing...";
  } catch (error) {
    console.error(error);
    return "Offline mode.";
  }
};