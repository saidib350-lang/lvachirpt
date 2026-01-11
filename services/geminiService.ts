import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, MessageSender } from '../types';

const LV_ACHIR_SYSTEM_INSTRUCTION = `You are LvachirPT, an expert AI agent specialized in hydraulics in Algeria. You will answer questions and provide solutions to hydraulic problems specific to the Algerian context, considering local regulations, infrastructure, and common issues. Your responses should be informative, accurate, and helpful for engineers, technicians, and students dealing with hydraulic challenges in Algeria.`;
const MODEL_NAME = 'gemini-3-flash-preview'; // Changed to flash model to address quota issues and better utilize free tier.

export async function sendMessageToGemini(
  prompt: string,
  history: ChatMessage[],
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const chatHistory = history.map(message => ({
    role: message.sender === MessageSender.User ? 'user' : 'model',
    parts: [{ text: message.text }],
  }));

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [...chatHistory, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: LV_ACHIR_SYSTEM_INSTRUCTION,
        temperature: 0.7, // Adjust temperature for more creative vs. factual responses
        topP: 0.95,
        topK: 64,
      },
    });

    const responseText = response.text;
    if (responseText) {
      return responseText;
    } else {
      console.warn("Gemini API returned an empty response text.");
      return "Désolé, je n'ai pas pu générer une réponse pour le moment. Veuillez réessayer.";
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error) {
        return `Une erreur est survenue lors de la communication avec l'IA: ${error.message}. Veuillez vérifier votre connexion ou réessayer plus tard.`;
    }
    return `Une erreur inconnue est survenue. Veuillez réessayer.`;
  }
}