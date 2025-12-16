import { GoogleGenAI } from "@google/genai";
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

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    const apiKey = "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";
    
    if (!apiKey) {
      return "I'm sorry, I'm currently offline (API Key missing). Please contact the admin.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We use a simple generateContent here for a single turn Q&A style, 
    // but in a full app we would manage chat history in a React context.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error processing your request. Please try again later.";
  }
};
