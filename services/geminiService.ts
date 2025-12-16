import Groq from "groq-sdk";
import { Slide } from '../types';

// Using the provided API Key directly.
const API_KEY = "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";

const groq = new Groq({ 
  apiKey: API_KEY, 
  dangerouslyAllowBrowser: true 
});

const SYSTEM_INSTRUCTION = `
You are a presentation expert. Your job is to take raw text or a topic and convert it into a structural JSON for a slide deck.

You must output a valid JSON object with a single key "slides" containing an array of slide objects.
Each slide object must have:
- title (string): Short punchy title.
- content (string): The main body text (keep it concise).
- bulletPoints (array of strings): 2-4 key takeaways.
- layout (one of: "title", "bullet", "split", "quote").
- imagePrompt (string): A descriptive English prompt to generate an AI image for this slide. It should describe a visual scene, style, or object related to the content. Do not use text in the image prompt.

Example JSON:
{
  "slides": [
    {
      "title": "NEO DESIGN",
      "content": "Bold shadows and high contrast.",
      "bulletPoints": ["Stark borders", "Vibrant colors"],
      "layout": "split",
      "imagePrompt": "abstract geometric 3d shapes, yellow and black, high contrast, neo brutalism style, 4k"
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
      model: "llama-3.3-70b-versatile",
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
  } catch (error: any) {
    console.error("Groq API Error:", error);
    // Return the actual error message to help debug
    return [
      {
        title: "Error Occurred",
        content: error?.message || "Failed to reach the AI service.",
        bulletPoints: ["Check Console for details", "Verify API Key", "Try again"],
        layout: "title",
        imagePrompt: "error warning sign glitch style red"
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
      model: "llama-3.3-70b-versatile"
    });
    return completion.choices[0]?.message?.content || "Processing...";
  } catch (error) {
    console.error(error);
    return "Offline mode (Check API Key).";
  }
};