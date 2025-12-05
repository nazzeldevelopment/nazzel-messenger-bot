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
  name: 'askv3',
  aliases: ['askcode', 'code', 'codehelp'],
  description: 'Ask for coding help (costs 20 coins)',
  category: 'economy',
  usage: 'askv3 <coding question>',
  examples: ['askv3 How to reverse a string in Python?'],
  cooldown: 15000,

  async execute({ api, event, args, reply, prefix }) {
    const userId = ('' + event.senderID).trim();
    const question = args.join(' ').trim();

    if (!question) {
      await reply(`╭───────────────────╮
│   💻 AI v3 CODE  │
╰───────────────────╯
📌 ${prefix}askv3 <question>
💰 Cost: 20 coins
🔧 Programming help`);
      return;
    }

    const client = getOpenAI();
    if (!client) {
      await reply(`❌ AI service not configured`);
      return;
    }

    const cost = 20;
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
      await reply(`💻 Generating code...`);

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful programming assistant. Provide clear, concise code examples with brief explanations. Keep responses under 1200 characters for chat. Use simple formatting without markdown code blocks (use plain text for code)."
          },
          { role: "user", content: question }
        ],
        max_tokens: 700,
      });

      const answer = response.choices[0]?.message?.content || "I couldn't generate a response.";
      
      await database.removeCoins(userId, cost, 'ai_usage', 'AI askv3 command');
      const newBalance = await database.getUserCoins(userId);

      const cleanAnswer = answer.replace(/```[\w]*\n?/g, '').replace(/```/g, '');
      const truncatedAnswer = cleanAnswer.length > 1400 ? cleanAnswer.substring(0, 1400) + '...' : cleanAnswer;

      await reply(`╭───────────────────╮
│   💻 AI v3 CODE  │
╰───────────────────╯
${truncatedAnswer}

💰 -${cost} │ Bal: ${newBalance.toLocaleString()}`);
    } catch (error: any) {
      await reply(`❌ ${error.message || 'AI Error'}`);
    }
  },
};
