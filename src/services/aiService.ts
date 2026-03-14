import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export async function getAIChatResponse(message: string, context: string) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are "Toybits", an AI helper for the Sangguniang Bayan of Batuan, Bohol.
    Your goal is to help citizens understand local ordinances, resolutions, news, session schedules, and details about the SB members.
    
    Context about Batuan Sangguniang Bayan:
    ${context}
    
    Guidelines:
    1. Be professional, polite, and helpful.
    2. Use the provided context to answer questions about specific ordinances, resolutions, news, sessions, or members.
    3. If you don't know the answer or it's not in the context, politely suggest contacting the Sangguniang Bayan Secretariat directly.
    4. Keep responses concise but informative.
    5. You can speak in English or Cebuano/Visayan if the user uses it, as Batuan is in Bohol.
    6. If asked about SB members, mention their positions and committee chairmanships if available in the context.
    7. If asked about sessions, provide the date and status (e.g., Scheduled, Completed).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: message,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text;
}
