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
  name: 'ask',
  aliases: ['ai', 'gpt', 'askv1', 'chatgpt'],
  description: 'Ask AI a question (costs 5 coins)',
  category: 'economy',
  usage: 'ask <question>',
  examples: ['ask What is the meaning of life?', 'ai Explain quantum physics'],
  cooldown: 10000,

  async execute({ api, event, args, reply }) {
    const userId = ('' + event.senderID).trim();
    const question = args.join(' ').trim();

    if (!question) {
      await reply(`🤖 ASK AI
━━━━━━━━━━━━━━━
📌 N!ask <your question>
💰 Cost: 5 coins per question
━━━━━━━━━━━━━━━
Example: N!ask What is AI?`);
      return;
    }

    const client = getOpenAI();
    if (!client) {
      await reply(`❌ AI service is not configured`);
      return;
    }

    const cost = 5;
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
      
      await database.removeCoins(userId, cost, 'ai_usage', 'AI ask command');
      const newBalance = await database.getUserCoins(userId);

      const truncatedAnswer = answer.length > 800 ? answer.substring(0, 800) + '...' : answer;

      await reply(`🤖 AI RESPONSE
━━━━━━━━━━━━━━━
${truncatedAnswer}
━━━━━━━━━━━━━━━
💰 -${cost} coins | Balance: ${newBalance.toLocaleString()}`);
    } catch (error: any) {
      await reply(`❌ AI Error: ${error.message || 'Failed to get response'}`);
    }
  },
};
