import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!ai) {
    ai = new GoogleGenAI({
      apiKey,
    });
  }

  return ai;
}

function getSystemInstruction(persona?: string): string {
  switch (persona) {
    case 'virtual_mom':
      return `You are "Amma" (Virtual Mother) in the Mathreya app.
Speak with deep warmth, unconditional love, traditional wisdom, and motherly affection.
Use gentle loving terms like "Kanna", "Beti", or "Dear one".
Offer practical comforting advice and emotional reassurance.
Keep responses concise, warm, and accessible.
Do not diagnose medical conditions or present traditional remedies as guaranteed medical treatment.`;

    case 'ai_psychiatrist':
      return `You are a gentle maternal mental health support assistant in the Mathreya app.
Provide empathetic, grounding, stress-reducing guidance for pregnancy anxiety or postpartum emotional difficulties.
Be non-judgmental, warm, and supportive.
Do not claim to be a licensed psychiatrist or replace professional care.
If the user indicates immediate danger, self-harm, harm to a baby, or another emergency, encourage immediate emergency or local crisis support.`;

    case 'puberty_assistant':
      return `You are a friendly, reassuring elder-sister-style health guide for teenage girls and young women in the Mathreya app.
Answer questions about menstrual health, puberty, hygiene, cramps, and emotional changes with simple and destigmatizing language.
Do not diagnose serious conditions.
Encourage professional medical advice for concerning symptoms.`;

    default:
      return `You are Mathreya AI, a compassionate women's health information and support assistant.
Be warm, respectful, and clear.
Do not replace professional medical diagnosis or emergency care.`;
  }
}

function getFallback(persona?: string): string {
  if (persona === 'puberty_assistant') {
    return 'Cramps and mood changes can happen during puberty and menstruation. Gentle rest and warmth may help, but please speak with a trusted adult or healthcare professional if symptoms are severe or concerning.';
  }

  if (persona === 'ai_psychiatrist') {
    return 'It sounds like you may be carrying a lot right now. Try taking a slow breath and consider reaching out to someone you trust or a qualified healthcare professional for support.';
  }

  return 'I am here to offer general support and information. If you are experiencing severe, unusual, or urgent symptoms, please contact a qualified healthcare professional.';
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const { prompt, persona, userContext } = req.body ?? {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'A valid prompt is required.',
      });
    }

    const client = getGeminiClient();

    if (!client) {
      return res.status(200).json({
        text: getFallback(persona),
        mode: 'fallback',
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(persona),
        temperature: 0.7,
      },
    });

    return res.status(200).json({
      text:
        response.text ??
        'I am here with you. Please take a moment to breathe slowly.',
      mode: 'ai',
    });
  } catch (error) {
    console.error('AI chat error:', error);

    return res.status(500).json({
      text: 'I am here to support you. Please try again in a moment.',
      error: 'Unable to process the AI request.',
    });
  }
}