import "server-only";

import OpenAI from "openai";

// Groq's endpoint is OpenAI-compatible, and its free tier (no card, no
// expiry) is what powers the meeting summary and Q&A features — text-only
// tasks that don't need the paid OpenAI Realtime voice API.
export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const GROQ_TEXT_MODEL = "openai/gpt-oss-120b";
