
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, Role } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(history: Message[], prompt: string): Promise<string> {
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Add current user prompt
    contents.push({
      role: Role.USER,
      parts: [{ text: prompt }]
    });

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
        },
      });

      return response.text || "I apologize, I could not generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I encountered a spiritual/technical difficulty. Please check your connection and try again.";
    }
  }

  async sendMessageStream(history: Message[], prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: Role.USER,
      parts: [{ text: prompt }]
    });

    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) onChunk(text);
      }
    } catch (error) {
      console.error("Gemini Streaming API Error:", error);
      onChunk("\n\n[Error: Connection interrupted. Please consult Church tradition or retry your question.]");
    }
  }
}

export const geminiService = new GeminiService();
