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
  name: 'askv1',
  aliases: ['ai', 'gpt', 'ask', 'chatgpt'],
  description: 'Ask AI a question (costs 5 coins)',
  category: 'economy',
  usage: 'askv1 <question>',
  examples: ['askv1 What is AI?', 'ai How does the internet work?'],
  cooldown: 10000,

  async execute({ api, event, args, reply, prefix }) {
    const userId = ('' + event.senderID).trim();
    const question = args.join(' ').trim();

    if (!question) {
      await reply(`╭───────────────────╮
│   🤖 AI v1       │
╰───────────────────╯
📌 ${prefix}askv1 <question>
💰 Cost: 5 coins
🔹 Fast responses`);
      return;
    }

    const client = getOpenAI();
    if (!client) {
      await reply(`❌ AI service not configured`);
      return;
    }

    const cost = 5;
    const currentCoins = await database.getUserCoins(userId);
    
    if (currentCoins < cost) {
      await reply(`╭───────────────────╮
│   💸 NO COINS    │
╰───────────────────╯
💰 Have: ${currentCoins.toLocaleString()}
💵 Need: ${cost}
📌 ${prefix}claim for coins`);
      return;
    }

    try {
      await reply(`🤖 Thinking...`);

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant. Keep responses concise and under 500 characters for chat. Be friendly and informative."
          },
          { role: "user", content: question }
        ],
        max_tokens: 300,
      });

      const answer = response.choices[0]?.message?.content || "I couldn't generate a response.";
      
      await database.removeCoins(userId, cost, 'ai_usage', 'AI askv1 command');
      const newBalance = await database.getUserCoins(userId);

      const truncatedAnswer = answer.length > 800 ? answer.substring(0, 800) + '...' : answer;

      await reply(`╭───────────────────╮
│   🤖 AI v1       │
╰───────────────────╯
${truncatedAnswer}

💰 -${cost} │ Bal: ${newBalance.toLocaleString()}`);
    } catch (error: any) {
      await reply(`❌ ${error.message || 'AI Error'}`);
    }
  },
};
