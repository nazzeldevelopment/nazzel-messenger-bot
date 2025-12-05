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
  name: 'askmax',
  aliases: ['askv5', 'gptmax', 'aimax', 'premium'],
  description: 'Premium AI with longest responses (costs 50 coins)',
  category: 'economy',
  usage: 'askmax <complex question>',
  examples: ['askmax Write a detailed analysis of climate change'],
  cooldown: 30000,

  async execute({ api, event, args, reply }) {
    const userId = ('' + event.senderID).trim();
    const question = args.join(' ').trim();

    if (!question) {
      await reply(`👑 ASK MAX (PREMIUM)
━━━━━━━━━━━━━━━
📌 N!askmax <your question>
💰 Cost: 50 coins
✨ Longest, most detailed responses
━━━━━━━━━━━━━━━
Best for complex questions!`);
      return;
    }

    const client = getOpenAI();
    if (!client) {
      await reply(`❌ AI service is not configured`);
      return;
    }

    const cost = 50;
    const currentCoins = await database.getUserCoins(userId);
    
    if (currentCoins < cost) {
      await reply(`❌ INSUFFICIENT BALANCE
━━━━━━━━━━━━━━━
💰 You have: ${currentCoins.toLocaleString()} coins
💵 Cost: ${cost} coins
━━━━━━━━━━━━━━━`);
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
      
      await database.removeCoins(userId, cost, 'ai_usage', 'AI askmax command');
      const newBalance = await database.getUserCoins(userId);

      const truncatedAnswer = answer.length > 2000 ? answer.substring(0, 2000) + '...' : answer;

      await reply(`👑 PREMIUM AI RESPONSE
━━━━━━━━━━━━━━━
${truncatedAnswer}
━━━━━━━━━━━━━━━
💰 -${cost} coins | Balance: ${newBalance.toLocaleString()}`);
    } catch (error: any) {
      await reply(`❌ AI Error: ${error.message || 'Failed to get response'}`);
    }
  },
};
