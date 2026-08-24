import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Mathreya Women Health Platform' });
});

// AI Chat Endpoint for Puberty Assistant, Prenatal/Postnatal AI Psychiatrist, and Virtual Mother
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, persona, userContext } = req.body;
    const client = getGeminiClient();

    let systemInstruction = 'You are Mathreya AI, a compassionate Indian women\'s health advisor.';
    
    if (persona === 'virtual_mom') {
      systemInstruction = `You are "Amma" (Virtual Mother) in the Mathreya app. Speak with deep warmth, unconditional love, traditional wisdom, and motherly affection. Use gentle loving terms like "Kanna", "Beti", or "Dear one". Offer practical comforting advice, traditional Indian grandmothers remedies (nuskhe like ajwain water, haldi milk, ginger tea), and emotional reassurance. Keep responses concise (2-4 sentences), warm, and accessible for women of all age groups.`;
    } else if (persona === 'ai_psychiatrist') {
      systemInstruction = `You are a gentle, certified maternal mental health counselor and psychiatrist in the Mathreya app. Provide empathetic, grounding, stress-reducing guidance for pregnancy anxiety or postpartum blues. Be non-judgmental, warm, comforting, and provide breathing exercises or soothing perspectives. Limit responses to 3-4 gentle sentences.`;
    } else if (persona === 'puberty_assistant') {
      systemInstruction = `You are a friendly, reassuring elder sister and health guide for teenage girls and young women in the Mathreya app. Answer questions about menstrual health, puberty, hygiene, cramps, and emotional changes with simple, destigmatizing, and encouraging language. Keep answers easy to read and reassuring.`;
    }

    if (client) {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'I am here with you, my dear. Rest softly and take deep breaths.';
      return res.json({ text: replyText });
    } else {
      // Warm fallback response when Gemini key is not configured
      let fallbackText = 'I am here with you, my child. Take a warm cup of herbal tea and rest comfortably. Everything will be well.';
      if (persona === 'puberty_assistant') {
        fallbackText = 'Cramps and mood changes are completely natural as your body grows. Drink warm water, keep a hot pouch on your lower belly, and give yourself gentleness today.';
      } else if (persona === 'ai_psychiatrist') {
        fallbackText = 'It is completely normal to feel overwhelmed during this journey. Take 3 deep breaths: inhale peace, exhale tension. You are doing wonderfully.';
      }
      return res.json({ text: fallbackText, note: 'Using Mathreya warm fallback response.' });
    }
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      text: 'My dear, I am right here. Take a deep breath and rest your mind.',
      error: err.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n==================================================');
    console.log('🌸 MATHREYA WOMEN\'S HEALTH PLATFORM ONLINE 🌸');
    console.log('==================================================');
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://127.0.0.1:${PORT}/`);
    console.log(`  ➜  Health:  http://localhost:${PORT}/api/health`);
    console.log('==================================================\n');
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${PORT} is in use. Please close the previous process or restart.`);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
