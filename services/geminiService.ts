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

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    // Note: In a production app, you should proxy requests through a backend
    // instead of exposing the API key in the frontend.
    const apiKey = "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";
    
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