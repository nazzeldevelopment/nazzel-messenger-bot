import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';
import OpenAI from 'openai';

let openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

export const command: Command = {
  name: 'askv5',
  aliases: ['askmax', 'gptmax', 'aimax', 'premium'],
  description: 'Premium AI with longest responses (PAID - requires donation)',
  category: 'economy',
  usage: 'askv5 <complex question>',
  examples: ['askv5 Write a detailed analysis of climate change'],
  cooldown: 30000,

  async execute({ api, event, args, reply, prefix }) {
    const userId = ('' + event.senderID).trim();
    const question = args.join(' ').trim();
    const ownerId = process.env.OWNER_ID;
    const isOwner = ownerId && userId === ownerId;

    const hasPremiumAccess = await database.getSetting<boolean>(`premium_${userId}`);

    if (!question) {
      await reply(`╭─────────────────────╮
│  👑 AI v5 PREMIUM  │
╰─────────────────────╯
📌 ${prefix}askv5 <question>
💎 PAID FEATURE

╭─ Payment Methods ─╮
│ 💳 PayPal         │
│ 📱 GCash          │
│ 💵 PayMaya        │
│ 🏦 Bank Transfer  │
╰───────────────────╯
📩 Contact owner for access
✨ Unlimited premium AI`);
      return;
    }

    if (!isOwner && !hasPremiumAccess) {
      await reply(`╭─────────────────────╮
│  🔒 PREMIUM ONLY   │
╰─────────────────────╯
This feature requires paid access.

╭─ How to Get Access ─╮
│ 1. Contact owner    │
│ 2. Choose payment:  │
│    💳 PayPal        │
│    📱 GCash         │
│    💵 PayMaya       │
│    🏦 Bank Transfer │
│ 3. Get activated!   │
╰────────────────────╯

📩 DM the bot owner for pricing
💎 Enjoy unlimited premium AI!`);
      return;
    }

    const client = getOpenAI();
    if (!client) {
      await reply(`❌ AI service not configured`);
      return;
    }

    try {
      await reply(`👑 Processing premium request...`);

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are an expert assistant. Provide comprehensive, well-researched, and detailed responses. Structure your answer clearly. Keep responses under 2000 characters for chat readability but be thorough."
          },
          { role: "user", content: question }
        ],
        max_tokens: 1000,
      });

      const answer = response.choices[0]?.message?.content || "I couldn't generate a response.";
      const truncatedAnswer = answer.length > 2000 ? answer.substring(0, 2000) + '...' : answer;

      await reply(`╭─────────────────────╮
│  👑 AI v5 PREMIUM  │
╰─────────────────────╯
${truncatedAnswer}

💎 Premium Member`);
    } catch (error: any) {
      await reply(`❌ ${error.message || 'AI Error'}`);
    }
  },
};
