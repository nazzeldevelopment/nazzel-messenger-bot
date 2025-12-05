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
  name: 'askpro',
  aliases: ['askv2', 'gptpro', 'aipro'],
  description: 'Ask AI Pro with better responses (costs 15 coins)',
  category: 'economy',
  usage: 'askpro <question>',
  examples: ['askpro Explain machine learning in detail'],
  cooldown: 15000,

  async execute({ api, event, args, reply }) {
    const userId = ('' + event.senderID).trim();
    const question = args.join(' ').trim();

    if (!question) {
      await reply(`🤖 ASK AI PRO
━━━━━━━━━━━━━━━
📌 N!askpro <your question>
💰 Cost: 15 coins
✨ Better quality responses
━━━━━━━━━━━━━━━`);
      return;
    }

    const client = getOpenAI();
    if (!client) {
      await reply(`❌ AI service is not configured`);
      return;
    }

    const cost = 15;
    const currentCoins = await database.getUserCoins(userId);
    
    if (currentCoins < cost) {
      await reply(`❌ INSUFFICIENT BALANCE
━━━━━━━━━━━━━━━
💰 You have: ${currentCoins.toLocaleString()} coins
💵 Cost: ${cost} coins
━━━━━━━━━━━━━━━
📌 N!claim - Get daily coins`);
      return;
    }

    try {
      await reply(`🤖 Processing your request...`);

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a knowledgeable assistant. Provide detailed, accurate, and well-structured responses. Keep responses under 1000 characters for chat readability."
          },
          { role: "user", content: question }
        ],
        max_tokens: 600,
      });

      const answer = response.choices[0]?.message?.content || "I couldn't generate a response.";
      
      await database.removeCoins(userId, cost, 'ai_usage', 'AI askpro command');
      const newBalance = await database.getUserCoins(userId);

      const truncatedAnswer = answer.length > 1200 ? answer.substring(0, 1200) + '...' : answer;

      await reply(`🤖 AI PRO RESPONSE
━━━━━━━━━━━━━━━
${truncatedAnswer}
━━━━━━━━━━━━━━━
💰 -${cost} coins | Balance: ${newBalance.toLocaleString()}`);
    } catch (error: any) {
      await reply(`❌ AI Error: ${error.message || 'Failed to get response'}`);
    }
  },
};
