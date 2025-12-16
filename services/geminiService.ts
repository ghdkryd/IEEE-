import Groq from "groq-sdk";
import { EVENTS, TEAM, PROJECTS, ORG_NAME, MISSION } from '../constants';

// Construct a system prompt that gives the AI context about the website data
const SYSTEM_INSTRUCTION = `
You are the helpful AI assistant for the ${ORG_NAME} website.
Your mission is: ${MISSION}

Here is the current data available on the website:

Upcoming Events:
${JSON.stringify(EVENTS.map(e => `${e.title} (${e.category}) on ${e.date}: ${e.description}`))}

Team Members:
${JSON.stringify(TEAM.map(t => `${t.name} - ${t.role} (${t.committee})`))}

Projects:
${JSON.stringify(PROJECTS.map(p => `${p.title}: ${p.description}`))}

Answer visitor questions based on this data. 
If asked about joining, encourage them to visit the Join Us page.
Keep answers concise, friendly, and professional.
Do not hallucinate events or people not listed here.
`;

// Helper function to safely get the API key from various environments
const getApiKey = (): string | undefined => {
  // 1. Try Vite environment variable (Modern standard)
  // @ts-ignore - import.meta.env might not be defined in all TS configurations
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_GROQ_API_KEY;
  }

  // 2. Try Create React App / Node environment variable (Legacy standard)
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_GROQ_API_KEY) {
    return process.env.REACT_APP_GROQ_API_KEY;
  }

  // 3. Fallback to hardcoded key (For testing/preview)
  // NOTE: Remove this in production and use environment variables above
  return "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";
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      return "I'm sorry, I'm currently offline (API Key missing). Please contact the admin.";
    }

    const groq = new Groq({ 
      apiKey,
      dangerouslyAllowBrowser: true 
    });
    
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Groq Error:", error);
    return "I encountered an error processing your request. Please try again later.";
  }
};